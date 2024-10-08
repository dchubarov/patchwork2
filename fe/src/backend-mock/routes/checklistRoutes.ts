import {AppServer} from "../domain";

const checklistRouteBasename = "checklists/v1/checklist/:checklistName";

export default function checklistRoutes(server: AppServer) {
    server.get(checklistRouteBasename, async (schema, request) => {
        return schema.where("checklistItem", (item) => item.list === request.params.checklistName);
    });

    server.post(checklistRouteBasename, async (_, request) => {
        const newItemAttrs = JSON.parse(request.requestBody);
        return server.create("checklistItem", {
            list: request.params.checklistName,
            note: newItemAttrs.note || "",
            done: newItemAttrs.done || false,
        });
    });

    server.put(checklistRouteBasename, async (schema, request) => {
        const updated = JSON.parse(request.requestBody);
        return schema.db.checklistItems.update(updated.id, updated);
    });
}
