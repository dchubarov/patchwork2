import {BelongsTo} from "miragejs/-types";
import {USER_ENTITY_KEY} from "@/mocker/domain/userEntity";
import {belongsTo} from "miragejs";

export interface EntityCommonAttributes {
    createdAt: Date,
    createdBy: BelongsTo<typeof USER_ENTITY_KEY>;
    createdById: string;
    lastModifiedAt: Date,
    lastModifiedBy: BelongsTo<typeof USER_ENTITY_KEY>;
    lastModifiedById: string;
}

export function commonAttributesModel() {
    return {
        createdBy: belongsTo(USER_ENTITY_KEY, {inverse: null}),
        lastModifiedBy: belongsTo(USER_ENTITY_KEY, {inverse: null})
    };
}

export function commonAttributesFactory() {
    return {
        createdAt: () => new Date(),
        createdById: "1000",
        lastModifiedAt: () => new Date(),
        lastModifiedById: "1000",
    };
}
