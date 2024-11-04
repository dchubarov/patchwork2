import z from "zod";

/** Checklist item base attributes */
const checklistItemSchema = z.object({
    /** Checklist item id */
    id: z.string(),
    /** Textual note */
    note: z.string(),
    /** Done flag */
    done: z.boolean().default(false),
    /** Color label */
    colorLabel: z.nullable(z.string()).default(null),
    /** Parent item id */
    parent: z.nullable(z.string()).default(null),
    /** Subitem ids */
    subitems: z.array(z.string()).default([]),
});

export const checklistSchema = z.object({
    /** Checklist id */
    id: z.nullable(z.string()).default(null),
    /** Checklist title */
    title: z.string(),
    /** Checklist items */
    items: z.array(checklistItemSchema).default([]),
});

export const checklistResponseSchema = z.object({
    checklist: checklistSchema,
});

export const checklistTemplateResponse: ChecklistResponseData = {
    checklist: {
        id: null,
        title: "Untitled",
        items: []
    }
}

export const checklistItemResponseSchema = z.object({
    checklistItem: checklistItemSchema,
});

export type ChecklistData = z.infer<typeof checklistSchema>;
export type ChecklistItemData = z.infer<typeof checklistItemSchema>;
export type ChecklistResponseData = z.infer<typeof checklistResponseSchema>;
export type ChecklistItemResponseData = z.infer<typeof checklistItemResponseSchema>;
