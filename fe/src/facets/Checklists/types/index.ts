import z from "zod";

const checklistItemSchema = z.object({
    id: z.string(),
    note: z.string(),
    done: z.boolean(),
    parentId: z.nullable(z.string()).default(null),
    colorLabel: z.nullable(z.string()).default(null),
    order: z.optional(z.number()),
});

const checklistConfigurationSchema = z.object({
    /** Enable custom order of elements, default `true` */
    enableCustomOrder: z.optional(z.boolean().default(true)),
});

export const checklistSchema = z.object({
    /** Checklist id */
    id: z.nullable(z.string()).default(null),
    /** Checklist title */
    title: z.optional(z.string()),
    /** Checklist configuration */
    configuration: z.optional(checklistConfigurationSchema),
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

export type ChecklistItemData = z.infer<typeof checklistItemSchema>;
export type ChecklistResponseData = z.infer<typeof checklistResponseSchema>;

export interface ChecklistGroupSummaryData {
    total: number;
    done: number;
}
