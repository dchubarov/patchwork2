import {SerializerInterface} from "miragejs/serializer";
import {Factory, Model, RestSerializer} from "miragejs";
import {AppServer, EntityCommonAttributes} from "./index";

export type ChecklistItemDb = {
    list: string;
    note: string;
    done: boolean;
} & EntityCommonAttributes

export const CHECKLIST_ITEM = "checklistItem";

const ChecklistEntity = {
    models: {
        [CHECKLIST_ITEM]: Model.extend<Partial<ChecklistItemDb>>({}),
    },

    factories: {
        [CHECKLIST_ITEM]: Factory.extend<Partial<ChecklistItemDb>>({
            createdAt: () => new Date(),
            updatedAt: () => new Date(),
        })
    },

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
