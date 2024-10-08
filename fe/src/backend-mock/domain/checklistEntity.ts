import {SerializerInterface} from "miragejs/serializer";
import {Model, RestSerializer} from "miragejs";
import {AppServer} from "./index";

export interface ChecklistItemDb {
    list: string;
    note: string,
    done: boolean
}

export const CHECKLIST_ITEM = "checklistItem";

const ChecklistEntity = {
    models: {
        [CHECKLIST_ITEM]: Model.extend<Partial<ChecklistItemDb>>({}),
    },

    factories: {},

    seeds: (server: AppServer) => {
        server.create("checklistItem", {list: "default", note: "Drop #car for service", done: false});
        server.create("checklistItem", {list: "default", note: "Buy groceries", done: false});
        server.create("checklistItem", {list: "secondary", note: "Learn MirageJS", done: false});
    },

    serializers: (_: SerializerInterface) => ({
        [CHECKLIST_ITEM]: RestSerializer,
    })
}

export default ChecklistEntity;
