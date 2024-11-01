import {Instantiate} from "miragejs/-types";
import {AppRegistry, AppServer} from "../domain";
import {CHECKLIST_ENTITY_KEY} from "../domain/checklistEntity";
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
    server.put(`${checklistRouteBasename}/checklist/:checklistId/item`);

    // Delete checklist item
    server.del(`${checklistRouteBasename}/checklist/:checklistId/item/:itemId`);

    /*
    server.get(checklistRouteBasename, async (schema, _) => {
        const uniqueChecklists = schema.all("checklistItem").models
            .map((item) => item.list)
            .filter((item, index, arr) => arr.indexOf(item) === index);

        return {
            "availableChecklists": uniqueChecklists.indexOf("default") < 0 ? ["default", ...uniqueChecklists] : uniqueChecklists
        }
    });

    server.get(checklistRouteList, async (schema, request) => {
        return schema.where("checklistItem", (item) => item.list === request.params.checklistName)
            .sort((a, b) => {
                const t1 = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
                const t2 = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
                return t2 - t1;
            });
    });

    server.post(checklistRouteList, async (schema, request) => {
        const json = JSON.parse(request.requestBody);
        const created = server.create(CHECKLIST_ITEM_ENTITY_KEY, {
            list: request.params.checklistName,
            note: json.note || "",
            done: json.done || false,
            colorLabel: json.colorLabel,
        });

        persistChecklistItems(schema);
        return created;
    });

    server.put(checklistRouteList, async (schema, request) => {
        const json = JSON.parse(request.requestBody);
        schema.db.checklistItems.update(json.id, {
            list: request.params.checklistName,
            note: json.note || "",
            done: json.done || false,
            colorLabel: json.colorLabel || null,
            updatedAt: new Date()
        });

        persistChecklistItems(schema);
        return schema.find(CHECKLIST_ITEM_ENTITY_KEY, json.id);
    });

    server.delete(checklistRouteList, async (schema, request) => {
        const id = request.queryParams.id;
        if (id === undefined || typeof id !== "string")
            return BadRequestResponse;

        const toDelete = schema.findBy(CHECKLIST_ITEM_ENTITY_KEY, (item) =>
            item.list === request.params.checklistName && item.id === id);

        if (!toDelete) {
            const msg = `Checklist item #${request.params.checklistItemId} not found in list ${request.params.checklistName}`;
            return new Response(404, undefined, {errors:[msg]});
        }

        toDelete.destroy();
        persistChecklistItems(schema);
        return toDelete;
    });
     */
}
