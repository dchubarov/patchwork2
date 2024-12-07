import { z } from 'zod';
import { nullishToUndefined } from '../utils/transform';

export const userRoleSchema = z.enum(['admin']);

export const userSchema = z.object({
  id: z.coerce.string(),
  email: z.string(),
  username: z.string(),
  roles: z
    .string()
    .nullish()
    .transform((value) => (value ? value.split(',') : []))
    .pipe(userRoleSchema.array()),
  firstname: z.string().nullish().transform(nullishToUndefined),
  lastname: z.string().nullish().transform(nullishToUndefined),
});

export const loginRequestSchema = z.object({
  login: z.string().trim().min(1),
  password: z.string(),
});

export const loginResponseSchema = z.object({
  user: userSchema,
  accessToken: z.string(),
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;
