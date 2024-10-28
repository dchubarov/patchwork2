import z from "zod";

const checklistItemSchema = z.object({
    id: z.string(),
    note: z.string(),
    parentId: z.nullable(z.string()),
    colorLabel: z.nullable(z.string()),
    order: z.number(),
});

const checklistOptionsSchema = z.object({
    /** Enable custom order of elements, default `true` */
    enableCustomOrder: z.optional(z.boolean().default(true)),
});

export const checklistSchema = z.object({
    /** Checklist id */
    id: z.string(),
    /** Checklist title */
    title: z.optional(z.string()),
    /** Checklist options */
    options: z.optional(checklistOptionsSchema),
    /** Checklist items */
    items: z.optional(z.array(checklistItemSchema)),
});

type Checklist = z.infer<typeof checklistSchema>;
