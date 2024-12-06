import { z } from 'zod';

export const userSchema = z.object({
  id: z.coerce.string(),
  email: z.string(),
  username: z.string(),
  firstname: z
    .string()
    .nullish()
    .transform((x) => x ?? undefined),
  lastname: z
    .string()
    .nullish()
    .transform((x) => x ?? undefined),
});

export const loginRequestSchema = z.object({
  login: z.string().trim().min(1),
  password: z.string(),
});

export const loginResponseSchema = z.object({
  user: userSchema,
  accessToken: z.string(),
});

// export type LoginResponse = z.infer<typeof loginResponseSchema>;
