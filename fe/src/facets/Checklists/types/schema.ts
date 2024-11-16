import z from 'zod';

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
  /** Allows to specify successor ID when making update request. */
  successor: z.optional(z.nullable(z.string())),
  /** Defines a relative position among other elements in group */
  sequenceCode: z.number(),
});

/** Checklist configuration */
const checklistConfigSchema = z.object({
  /** Reverse order of sequence (last added items go first) */
  reverseOrder: z.optional(z.boolean()),
});

/** Checklist overall progress */
const checklistProgressSchema = z.object({
  /** Total doable items (non-groups) */
  doableCount: z.number().default(0),
  /** Number of items done */
  doneCount: z.number().default(0),
});

const checklistBaseSchema = z.object({
  /** Checklist id */
  id: z.nullable(z.string()).default(null),
  /** Checklist title */
  title: z.string(),
  /** Checklist progress, contains done/doable count at fetch time */
  progress: z.optional(checklistProgressSchema),
  /** Checklist configuration */
  config: z.optional(checklistConfigSchema),
});

export const checklistSchema = checklistBaseSchema.extend({
  /** Checklist items */
  items: z.array(checklistItemSchema).default([]),
});

export const allChecklistsResponseSchema = z.object({
  checklists: z.array(checklistBaseSchema).default([]),
});

export const checklistResponseSchema = z.object({
  checklist: checklistSchema,
});

export const checklistTemplateResponse: ChecklistResponseData = {
  checklist: {
    id: null,
    title: 'Untitled',
    config: {},
    items: [],
  },
};

export const checklistItemResponseSchema = z.object({
  checklistItem: checklistItemSchema,
});

export type ChecklistBaseData = z.infer<typeof checklistBaseSchema>;
export type ChecklistData = z.infer<typeof checklistSchema>;
export type ChecklistItemData = z.infer<typeof checklistItemSchema>;
export type ChecklistResponseData = z.infer<typeof checklistResponseSchema>;
export type ChecklistItemResponseData = z.infer<
  typeof checklistItemResponseSchema
>;
