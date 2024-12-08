import { z } from 'zod';
import { nullishToUndefined } from './utils';

export const userRoleSchema = z.enum(['admin', 'developer']);

export const userSchema = z.object({
  id: z.coerce.string(),
  email: z.string(),
  username: z.string(),
  roles: userRoleSchema.array().default([]),
  firstname: z.string().nullish().transform(nullishToUndefined),
  lastname: z.string().nullish().transform(nullishToUndefined),
});

export type UserRole = z.infer<typeof userRoleSchema>;
export type User = z.infer<typeof userSchema>;
