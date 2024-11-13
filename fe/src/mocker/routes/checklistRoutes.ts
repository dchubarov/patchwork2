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

      item.attrs.sequenceCode = parseInt(item.id!!);
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

      try {
        if (json.parent !== undefined) {
          (checklistItem as any).parentId = json.parent;
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
      } catch (e) {
        return ServerErrorResponse;
      }
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
