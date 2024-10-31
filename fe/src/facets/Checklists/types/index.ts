import z, {ZodType} from "zod";

/** Checklist item base attributes */
const baseChecklistItemSchema = z.object({
    /** Checklist item id */
    id: z.string(),
    /** Textual note */
    note: z.string(),
    /** Done flag */
    done: z.optional(z.boolean()),
    /** Color label */
    colorLabel: z.optional(z.nullable(z.string()).default(null))
});

export type ChecklistItemData = z.infer<typeof baseChecklistItemSchema> & {
    items: ChecklistItemData[];
};

const checklistItemSchema: ZodType<ChecklistItemData> = baseChecklistItemSchema.extend({
    /** Nested items */
    items: z.lazy(() => checklistItemSchema.array()),
});

export const checklistSchema = z.object({
    /** Checklist id */
    id: z.nullable(z.string()).default(null),
    /** Checklist title */
    title: z.optional(z.string()),
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

export type ChecklistResponseData = z.infer<typeof checklistResponseSchema>;
