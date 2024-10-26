import {SerializerInterface} from "miragejs/serializer";
import {Factory, Model, RestSerializer} from "miragejs";
import {AppServer, EntityCommonAttributes} from "./index";

export type ChecklistItemDb = {
    list: string;
    note: string;
    done: boolean;
    colorLabel: string | null;
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
        server.create("checklistItem", {list: "default", note: "Drop #car for service", done: false, colorLabel: null});
        server.create("checklistItem", {list: "default", note: "Buy groceries", done: false, colorLabel: "teal"});
        server.create("checklistItem", {list: "secondary", note: "Learn MirageJS", done: false, colorLabel: null});
    },

    serializers: (_: SerializerInterface) => ({
        [CHECKLIST_ITEM]: RestSerializer,
    })
}

export default ChecklistEntity;
