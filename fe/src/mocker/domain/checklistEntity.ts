import {BelongsTo, HasMany} from "miragejs/-types";
import {SerializerInterface} from "miragejs/serializer";
import {belongsTo, Factory, hasMany, Model, RestSerializer} from "miragejs";
import {AppServer, EntityCommonAttributes} from "./index";
import {USER_ENTITY_KEY} from "./userEntity";

export const CHECKLIST_ENTITY_KEY = "checklist";
export const CHECKLIST_ITEM_ENTITY_KEY = "checklistItem";

export type ChecklistDb = {
    ownerId: string;
    owner: BelongsTo<typeof USER_ENTITY_KEY>;
    items: HasMany<typeof CHECKLIST_ITEM_ENTITY_KEY>;
    title: string;
} & EntityCommonAttributes;

export type ChecklistItemDb = {
    authorId: string;
    author: BelongsTo<typeof USER_ENTITY_KEY>;
    items: HasMany<typeof CHECKLIST_ITEM_ENTITY_KEY>;
    note: string;
    done: boolean;
    colorLabel: string | null;
} & EntityCommonAttributes;

const ChecklistEntity = {
    models: {
        [CHECKLIST_ENTITY_KEY]: Model.extend<Partial<ChecklistDb>>({
            owner: belongsTo(USER_ENTITY_KEY, {inverse: null}),
            items: hasMany(CHECKLIST_ITEM_ENTITY_KEY, {inverse: null}),
        }),

        [CHECKLIST_ITEM_ENTITY_KEY]: Model.extend<Partial<ChecklistItemDb>>({
            author: belongsTo(USER_ENTITY_KEY, {inverse: null}),
            items: hasMany(CHECKLIST_ITEM_ENTITY_KEY, {inverse: null}),
        }),
    },

    factories: {
        [CHECKLIST_ENTITY_KEY]: Factory.extend<Partial<ChecklistDb>>({
            createdAt: () => new Date(),
            updatedAt: () => new Date(),
        }),

        [CHECKLIST_ITEM_ENTITY_KEY]: Factory.extend<Partial<ChecklistItemDb>>({
            done: false,
            colorLabel: null,
            createdAt: () => new Date(),
            updatedAt: () => new Date(),
        }),
    },

    serializers: (_: SerializerInterface) => ({
        [CHECKLIST_ENTITY_KEY]: RestSerializer.extend({
            include: ["owner", "items"],
            embed: (key) => key === "items",
        }),

        [CHECKLIST_ITEM_ENTITY_KEY]: RestSerializer.extend({
            include: ["author", "items"],
            embed: (key) => key === "items",
        }),
    }),

    seeds: (server: AppServer) => {
        server.create(CHECKLIST_ENTITY_KEY, {
            title: "My checklist", ownerId: "1000", itemIds: [
                server.create(CHECKLIST_ITEM_ENTITY_KEY, {note: "Buy groceries", itemIds: [
                        server.create(CHECKLIST_ITEM_ENTITY_KEY, {note: "Turnip x3", done: true}).id,
                        server.create(CHECKLIST_ITEM_ENTITY_KEY, {note: "Coca-cola", itemIds: [
                                server.create(CHECKLIST_ITEM_ENTITY_KEY, {note: "A bottle"}).id
                            ]
                        }).id,
                        server.create(CHECKLIST_ITEM_ENTITY_KEY, {note: "Apples x15"}).id,
                        server.create(CHECKLIST_ITEM_ENTITY_KEY, {note: "Dill"}).id,
                    ]
                }).id,
                server.create(CHECKLIST_ITEM_ENTITY_KEY, {note: "Relax a bit", itemIds: [
                        server.create(CHECKLIST_ITEM_ENTITY_KEY, {note: "Go to mountains"}).id,
                    ]
                }).id,
                server.create(CHECKLIST_ITEM_ENTITY_KEY, {note: "Take a note"}).id,
            ]
        });

        server.create(CHECKLIST_ENTITY_KEY, {title: "My checklist #2", ownerId: "1000"});
    },
}

export default ChecklistEntity;
