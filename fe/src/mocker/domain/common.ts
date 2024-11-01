
export interface EntityCommonAttributes {
    createdAt: Date,
    updatedAt: Date,
}

export function commonAttributesFactory() {
    return {
        createdAt: () => new Date(),
        updatedAt: () => new Date(),
    };
}
