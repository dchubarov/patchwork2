import {Instantiate} from "miragejs/-types";
import {AppRegistry, AppServer} from "../domain";
import {CHECKLIST_ENTITY_KEY, CHECKLIST_ITEM_ENTITY_KEY} from "../domain/checklistEntity";
import {ForbiddenError, handleWithAuthorization} from "../utils/authorization";
import {USER_ENTITY_KEY, UserDbModel} from "../domain/userEntity";
import {NotFoundResponse} from "../utils/response";

export default function checklistRoutes(server: AppServer) {
    const checklistRouteBasename = "/checklists/v2";

    const verifyChecklistAccess = (
        checklist: Instantiate<AppRegistry, typeof CHECKLIST_ENTITY_KEY>,
        user: UserDbModel,
        _accessLevel: "read" | "write" = "read"
    ) => {
        if (user.id !== checklist.createdById)
            throw new ForbiddenError();
    }

    // Get available checklists
    server.get(`${checklistRouteBasename}/checklist`, handleWithAuthorization(
        (schema, _request, user) => {
            const usersIds = new Set<string>();
            const checklists = schema
                .where(CHECKLIST_ENTITY_KEY, {createdById: user.id})
                .models
                .map(e => {
                    e.createdBy?.id && usersIds.add(e.createdBy.id);
                    e.lastModifiedBy?.id && usersIds.add(e.lastModifiedBy.id);
                    return {
                        id: e.id,
                        title: e.title,
                        createdBy: e.createdBy?.id,
                        createdAt: e.createdAt,
                        lastModifiedBy: e.lastModifiedBy?.id,
                        lastModifiedAt: e.lastModifiedAt,
                    }
                });

            const users = schema.where(USER_ENTITY_KEY,
                (instance) => instance.id && usersIds.has(instance.id))
                .models;

            return {
                checklists,
                users
            };
        }));

    // Add a new checklist
    server.post(`${checklistRouteBasename}/checklist`);

    // Get checklist contents
    server.get(`${checklistRouteBasename}/checklist/:checklistId`, handleWithAuthorization(
        (schema, request, user) => {
            const checklist = schema.find(CHECKLIST_ENTITY_KEY, request.params.checklistId);
            if (!checklist) {
                return NotFoundResponse;
            }

            verifyChecklistAccess(checklist, user, "read");
            return checklist;
        }));

    // Update checklist title/options
    server.put(`${checklistRouteBasename}/checklist/:checklistId`);

    // Delete a checklist identified by checklistId
    server.del(`${checklistRouteBasename}/checklist/:checklistId`);

    // Add new checklist item
    server.post(`${checklistRouteBasename}/checklist/:checklistId/item`);

    // Update checklist item
    server.put(`${checklistRouteBasename}/checklist/:checklistId/item`, handleWithAuthorization(
        async (schema, request, user) => {
            const checklistId = request.params.checklistId;
            const checklist = schema.find(CHECKLIST_ENTITY_KEY, checklistId);
            if (!checklist) {
                return NotFoundResponse;
            }
            verifyChecklistAccess(checklist, user, "write");

            const json = JSON.parse(request.requestBody).checklistItem;
            const checklistItem = schema.find(CHECKLIST_ITEM_ENTITY_KEY, json?.id);
            if (!checklistItem || checklistItem.checklistId !== checklistId) {
                return NotFoundResponse;
            }

            checklistItem.note = json.note ?? checklistItem.note;
            checklistItem.done = json.done ?? checklistItem.done;
            checklistItem.colorLabel = json.colorLabel !== undefined ? json.colorLabel : checklistItem.colorLabel;
            checklistItem.lastModifiedById = user.id;
            checklistItem.lastModifiedAt = new Date();
            checklistItem.save();

            return checklistItem;
        }
    ));

    // Delete checklist item
    server.del(`${checklistRouteBasename}/checklist/:checklistId/item/:itemId`);
}
