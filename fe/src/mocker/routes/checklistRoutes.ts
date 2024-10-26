import {Response} from "miragejs";
import Schema from "miragejs/orm/schema";
import {AppRegistry, AppServer} from "../domain";
import {CHECKLIST_ITEM} from "../domain/checklistEntity";
import {BadRequestResponse} from "./index";

const checklistRouteBasename = "/checklists/v1";
const checklistRouteList = checklistRouteBasename + "/checklist/:checklistName";

export default function checklistRoutes(server: AppServer) {
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
        const created = server.create(CHECKLIST_ITEM, {
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
        return schema.find(CHECKLIST_ITEM, json.id);
    });

    server.delete(checklistRouteList, async (schema, request) => {
        const id = request.queryParams.id;
        if (id === undefined || typeof id !== "string")
            return BadRequestResponse;

        const toDelete = schema.findBy(CHECKLIST_ITEM, (item) =>
            item.list === request.params.checklistName && item.id === id);

        if (!toDelete) {
            const msg = `Checklist item #${request.params.checklistItemId} not found in list ${request.params.checklistName}`;
            return new Response(404, undefined, {errors:[msg]});
        }

        toDelete.destroy();
        persistChecklistItems(schema);
        return toDelete;
    });
}

function persistChecklistItems(_: Schema<AppRegistry>) {
    // localStorage.setItem("__temp.db.checklistItems", JSON.stringify(schema.db.checklistItems));
}
