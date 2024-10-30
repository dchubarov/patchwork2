import {SerializerInterface} from "miragejs/serializer";
import {Factory, hasMany, Model, RestSerializer} from "miragejs";
import {AppServer, EntityCommonAttributes} from "./index";
import {HasMany} from "miragejs/-types";

export const CHECKLIST_ENTITY_KEY = "checklist";
export const CHECKLIST_ITEM_ENTITY_KEY = "checklistItem";

interface ChecklistConfigurationDb {
    enableReordering?: boolean;
    maxHierarchyLevels?: number;
}

export type ChecklistDb = {
    title: string;
    authorId: string;
    items: HasMany<typeof CHECKLIST_ITEM_ENTITY_KEY>;
    configuration?: ChecklistConfigurationDb;
} & EntityCommonAttributes;

type ChecklistItemDb = {
    note: string;
    done: boolean;
    authorId: string;
    colorLabel: string | null;
    parentId: string | null;
    orderKey: number | null;
} & EntityCommonAttributes;

const ChecklistEntity = {
    models: {
        [CHECKLIST_ENTITY_KEY]: Model.extend<Partial<ChecklistDb>>({
            items: hasMany(CHECKLIST_ITEM_ENTITY_KEY),
        }),

        [CHECKLIST_ITEM_ENTITY_KEY]: Model.extend<Partial<ChecklistItemDb>>({}),
    },

    factories: {
        [CHECKLIST_ENTITY_KEY]: Factory.extend<Partial<ChecklistDb>>({
            createdAt: () => new Date(),
            updatedAt: () => new Date(),
        }),
        [CHECKLIST_ITEM_ENTITY_KEY]: Factory.extend<Partial<ChecklistItemDb>>({
            createdAt: () => new Date(),
            updatedAt: () => new Date(),
            authorId: "1000",
            parentId: null,
        })
    },

    seeds: (server: AppServer) => {
        server.create(CHECKLIST_ENTITY_KEY, {
            title: "My checklist", authorId: "1000", itemIds: [
                server.create(CHECKLIST_ITEM_ENTITY_KEY, {
                    id: "10",
                    checklistId: 1,
                    note: "Drop #car for service",
                    done: false,
                    colorLabel: null
                }).id,
                server.create(CHECKLIST_ITEM_ENTITY_KEY, {
                    id: "20",
                    checklistId: 1,
                    note: "Buy groceries",
                    done: false,
                    colorLabel: "teal",
                }).id,
                server.create(CHECKLIST_ITEM_ENTITY_KEY, {
                    id: "21",
                    checklistId: 1,
                    note: "Turnip x3",
                    done: true,
                    parentId: "20",
                }).id,
                server.create(CHECKLIST_ITEM_ENTITY_KEY, {
                    id: "22",
                    checklistId: 1,
                    note: "Coca-cola",
                    done: false,
                    parentId: "20",
                }).id,
                server.create(CHECKLIST_ITEM_ENTITY_KEY, {
                    id: "221",
                    checklistId: 1,
                    note: "Bottle",
                    done: false,
                    parentId: "22",
                }).id,
                server.create(CHECKLIST_ITEM_ENTITY_KEY, {
                    id: "30",
                    checklistId: 1,
                    note: "Take a note",
                    done: false,
                }).id,
                server.create(CHECKLIST_ITEM_ENTITY_KEY, {
                    id: "40",
                    checklistId: 1,
                    note: "Build a house",
                    done: false,
                }).id,
            ]
        });
        server.create(CHECKLIST_ENTITY_KEY, {
            title: "My checklist #2", authorId: "1000", itemIds: [
                server.create(CHECKLIST_ITEM_ENTITY_KEY, {
                    id: "50",
                    checklistId: 2,
                    note: "Learn MirageJS",
                    done: false,
                    colorLabel: null
                }).id,
            ]
        });
        server.create(CHECKLIST_ENTITY_KEY, {
            title: "Unknown user's checklist", authorId: "9999", itemIds: []
        });
    },

    serializers: (_: SerializerInterface) => ({
        [CHECKLIST_ITEM_ENTITY_KEY]: RestSerializer.extend({}),
        [CHECKLIST_ENTITY_KEY]: RestSerializer.extend({
            include: ["owner", "items"],
            embed: true,
        })
    })
}

export default ChecklistEntity;
