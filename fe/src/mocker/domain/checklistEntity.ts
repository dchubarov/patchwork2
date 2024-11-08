import {BelongsTo, HasMany} from "miragejs/-types";
import {SerializerInterface} from "miragejs/serializer";
import {belongsTo, Factory, hasMany, Model, RestSerializer} from "miragejs";
import {AppServer} from "./index";
import {commonAttributesFactory, commonAttributesModel, EntityCommonAttributes} from "./common";

export const CHECKLIST_ENTITY_KEY = "checklist";
export const CHECKLIST_ITEM_ENTITY_KEY = "checklistItem";

export interface ChecklistProgress {
    doableCount: number;
    doneCount: number;
}

export type ChecklistDb = {
    items: HasMany<typeof CHECKLIST_ITEM_ENTITY_KEY>;
    title: string;
    progress?: ChecklistProgress;
} & EntityCommonAttributes;

export type ChecklistItemDb = {
    checklistId: string;
    checklist: BelongsTo<typeof CHECKLIST_ENTITY_KEY>;
    parent: BelongsTo<typeof CHECKLIST_ITEM_ENTITY_KEY>;
    subitems: HasMany<typeof CHECKLIST_ITEM_ENTITY_KEY>;
    note: string;
    done: boolean;
    colorLabel: string | null;
    sequenceCode: number;
} & EntityCommonAttributes;

const ChecklistEntity = {
    models: {
        [CHECKLIST_ENTITY_KEY]: Model.extend<Partial<ChecklistDb>>({
            ...commonAttributesModel(),
            items: hasMany(CHECKLIST_ITEM_ENTITY_KEY, {inverse: "checklist"}),
        }),

        [CHECKLIST_ITEM_ENTITY_KEY]: Model.extend<Partial<ChecklistItemDb>>({
            ...commonAttributesModel(),
            checklist: belongsTo(CHECKLIST_ENTITY_KEY, {inverse: "items"}),
            parent: belongsTo(CHECKLIST_ITEM_ENTITY_KEY, {inverse: "subitems"}),
            subitems: hasMany(CHECKLIST_ITEM_ENTITY_KEY, {inverse: "parent"}),
        }),
    },

    factories: {
        [CHECKLIST_ENTITY_KEY]: Factory.extend<Partial<ChecklistDb>>({
            ...commonAttributesFactory(),
            progress: {doableCount: 0, doneCount: 0},
        }),

        [CHECKLIST_ITEM_ENTITY_KEY]: Factory.extend<Partial<ChecklistItemDb>>({
            ...commonAttributesFactory(),
            sequenceCode: (num) => num + 1,
            colorLabel: null,
            done: false,
        }),
    },

    serializers: (_: SerializerInterface) => ({
        [CHECKLIST_ENTITY_KEY]: RestSerializer.extend({
            include: ["items", "createdBy", "lastModifiedBy"],
            embed: (key) => key === "items",
        }),

        [CHECKLIST_ITEM_ENTITY_KEY]: RestSerializer.extend({
            include: ["createdBy", "lastModifiedBy"],
            embed: false,
        }),
    }),

    seeds: (server: AppServer) => {
        server.create(CHECKLIST_ENTITY_KEY, {id: "dime1", title: "My checklist"});
        server.create(CHECKLIST_ITEM_ENTITY_KEY, {id: "1", checklistId: "dime1", note: "Buy groceries"});
        server.create(CHECKLIST_ITEM_ENTITY_KEY, {id: "2", checklistId: "dime1", note: "Turnip x3", parentId: "1"});
        server.create(CHECKLIST_ITEM_ENTITY_KEY, {id: "3", checklistId: "dime1", note: "Coca-cola", parentId: "1"});
        server.create(CHECKLIST_ITEM_ENTITY_KEY, {id: "4", checklistId: "dime1", note: "Bottle", parentId: "3", done: true});
        server.create(CHECKLIST_ITEM_ENTITY_KEY, {id: "5", checklistId: "dime1", note: "Relax a bit"});
        server.create(CHECKLIST_ITEM_ENTITY_KEY, {id: "6", checklistId: "dime1", note: "Go to mountains", parentId: "5"});
        server.create(CHECKLIST_ITEM_ENTITY_KEY, {id: "7", checklistId: "dime1", note: "Take a note"});
        server.create(CHECKLIST_ITEM_ENTITY_KEY, {id: "8", checklistId: "dime1", note: "Dill", parentId: "1"});
    },
}

export default ChecklistEntity;
