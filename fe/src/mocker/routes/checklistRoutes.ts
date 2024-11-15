import { Instantiate } from 'miragejs/-types';
import { AppRegistry, AppSchema, AppServer } from '../domain';
import {
  CHECKLIST_ENTITY_KEY,
  CHECKLIST_ITEM_ENTITY_KEY,
} from '../domain/checklistEntity';
import { handleWithAuthorization } from '../utils/authorization';
import { USER_ENTITY_KEY } from '../domain/userEntity';
import {
  BadRequestResponse,
  ForbiddenResponse,
  NotFoundResponse,
  ServerErrorResponse,
} from '../utils/response';

export default function checklistRoutes(server: AppServer) {
  const checklistRouteBasename = '/checklists/v2';

  // Get available checklists
  server.get(
    `${checklistRouteBasename}/checklist`,
    handleWithAuthorization((schema, _request, user) => {
      const usersIds = new Set<string>();
      const checklists = schema
        .where(CHECKLIST_ENTITY_KEY, { createdById: user.id })
        .models.map((checklist) => {
          checklist.createdBy?.id && usersIds.add(checklist.createdBy.id);
          checklist.lastModifiedBy?.id &&
            usersIds.add(checklist.lastModifiedBy.id);
          recalculateChecklistProgress(checklist);
          return {
            id: checklist.id,
            title: checklist.title,
            progress: checklist.progress,
            createdBy: checklist.createdBy?.id,
            createdAt: checklist.createdAt,
            lastModifiedBy: checklist.lastModifiedBy?.id,
            lastModifiedAt: checklist.lastModifiedAt,
          };
        });

      const users = schema.where(
        USER_ENTITY_KEY,
        (instance) => instance.id && usersIds.has(instance.id)
      ).models;

      return {
        checklists,
        users,
      };
    })
  );

  // Add a new checklist
  server.post(`${checklistRouteBasename}/checklist`);

  // Get checklist contents
  server.get(
    `${checklistRouteBasename}/checklist/:checklistId`,
    handleWithAuthorization((schema, request, user) => {
      const checklist = ensureChecklist(
        schema,
        request.params.checklistId,
        user.id,
        'read'
      );
      recalculateChecklistProgress(checklist);
      return checklist;
    })
  );

  // Update checklist title/options
  server.put(`${checklistRouteBasename}/checklist/:checklistId`);

  // Delete a checklist identified by checklistId
  server.del(`${checklistRouteBasename}/checklist/:checklistId`);

  // Add new checklist item
  server.post(
    `${checklistRouteBasename}/checklist/:checklistId/item`,
    handleWithAuthorization(async (schema, request, user) => {
      const checklistId = request.params.checklistId;
      ensureChecklist(schema, checklistId, user.id, 'write');

      const json = JSON.parse(request.requestBody).checklistItem;
      if (!json || !json.note || json.id !== '') return BadRequestResponse;

      const item = schema.create(CHECKLIST_ITEM_ENTITY_KEY, {
        checklistId,
        note: json.note,
        colorLabel: json.colorLabel ?? null,
        done: json.done ?? false,
        parentId: json.parent ?? null,
      });

      item.attrs.sequenceCode = calculateSequenceCode(schema, item);
      item.save();

      return item;
    })
  );

  // Update checklist item
  server.put(
    `${checklistRouteBasename}/checklist/:checklistId/item`,
    handleWithAuthorization(async (schema, request, user) => {
      const checklistId = request.params.checklistId;
      ensureChecklist(schema, checklistId, user.id, 'write');

      const json = JSON.parse(request.requestBody).checklistItem;
      const checklistItem = ensureChecklistItem(schema, json?.id, checklistId);

      if (json.parent !== undefined || json.successor !== undefined) {
        let updateSeq = false;
        if (
          json.parent !== undefined &&
          json.parent !== (checklistItem as any).parentId
        ) {
          checkPossibleParent(schema, checklistItem, json.parent);
          (checklistItem as any).parentId = json.parent;
          updateSeq = true;
        }

        if (json.successor !== undefined) updateSeq = true;

        if (updateSeq)
          checklistItem.sequenceCode = calculateSequenceCode(
            schema,
            checklistItem,
            json.successor
          );
      }

      checklistItem.note = json.note ?? checklistItem.note;
      checklistItem.done = json.done ?? checklistItem.done;
      checklistItem.colorLabel =
        json.colorLabel !== undefined
          ? json.colorLabel
          : checklistItem.colorLabel;
      checklistItem.lastModifiedById = user.id;
      checklistItem.lastModifiedAt = new Date();
      checklistItem.save();

      return checklistItem;
    })
  );

  // Delete checklist item
  server.del(
    `${checklistRouteBasename}/checklist/:checklistId/item/:itemId`,
    handleWithAuthorization(async (schema, request, user) => {
      const checklistId = request.params.checklistId;
      ensureChecklist(schema, checklistId, user.id, 'write');
      const checklistItem = ensureChecklistItem(
        schema,
        request.params.itemId,
        checklistId
      );

      function deleteCascade(
        item: Instantiate<AppRegistry, typeof CHECKLIST_ITEM_ENTITY_KEY>
      ) {
        item.subitems?.models.forEach((e) => deleteCascade(e));
        item.destroy();
      }

      deleteCascade(checklistItem);
    })
  );
}

// Private

function ensureChecklist(
  schema: AppSchema,
  checklistId: string,
  userId?: string | null,
  _access?: 'read' | 'write'
) {
  const checklist = schema.find(CHECKLIST_ENTITY_KEY, checklistId);
  if (!checklist) throw NotFoundResponse;

  if (userId !== checklist.createdById) throw ForbiddenResponse;

  return checklist;
}

function ensureChecklistItem(
  schema: AppSchema,
  itemId?: string,
  checklistId?: string
) {
  if (!itemId) throw BadRequestResponse;

  const checklistItem = schema.find(CHECKLIST_ITEM_ENTITY_KEY, itemId);
  if (!checklistItem) throw NotFoundResponse;

  if (checklistId && checklistItem.checklist?.id !== checklistId)
    throw NotFoundResponse;

  return checklistItem;
}

function recalculateChecklistProgress(
  checklist: Instantiate<AppRegistry, typeof CHECKLIST_ENTITY_KEY>
) {
  checklist.progress = { doableCount: 0, doneCount: 0 };
  checklist?.items?.models.forEach((item) => {
    if (!item.subitems || item.subitems.length < 1) {
      checklist.progress!!.doableCount++;
      if (item.done) checklist.progress!!.doneCount++;
    }
  });
}

function checkPossibleParent(
  schema: AppSchema,
  checklistItem: Instantiate<AppRegistry, typeof CHECKLIST_ITEM_ENTITY_KEY>,
  newParentId: string | null
) {
  if (newParentId == null) return;
  if (newParentId === checklistItem.id) throw BadRequestResponse;

  let parent: Instantiate<
    AppRegistry,
    typeof CHECKLIST_ITEM_ENTITY_KEY
  > | null = ensureChecklistItem(
    schema,
    newParentId,
    checklistItem.checklistId
  );

  while (parent) {
    if (parent.id === checklistItem.id) {
      throw BadRequestResponse;
    }
    parent = parent.parent ?? null;
  }
}

function calculateSequenceCode(
  schema: AppSchema,
  checklistItem: Instantiate<AppRegistry, typeof CHECKLIST_ITEM_ENTITY_KEY>,
  successorId: string | null = null
) {
  if (!checklistItem.id) throw ServerErrorResponse;
  const baselineSeq = parseInt(checklistItem.id);

  const itemsInGroup = schema
    .where(CHECKLIST_ITEM_ENTITY_KEY, {
      parentId: checklistItem.parent?.id ?? null,
    } as any)
    .filter((e) => e.id !== checklistItem.id)
    .sort((a, b) => (a.sequenceCode ?? 0) - (b.sequenceCode ?? 0)).models;

  if (itemsInGroup.length < 1) return baselineSeq;
  if (successorId) {
    const i = itemsInGroup.findIndex((e) => e.id === successorId);
    if (i >= 0) {
      const successorSeq = itemsInGroup[i].sequenceCode!!;
      const predecessorSeq = i > 0 ? itemsInGroup[i - 1].sequenceCode!! : 0;
      return (predecessorSeq + successorSeq) / 2;
    }
  }
  return itemsInGroup[itemsInGroup.length - 1].sequenceCode!! + 1;
}
