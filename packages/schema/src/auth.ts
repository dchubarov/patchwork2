import { z } from 'zod';
import { userSchema } from './user';

export const loginRequestSchema = z.object({
  login: z.string().trim().min(1),
  password: z.string(),
});

export const loginResponseSchema = z.object({
  user: userSchema,
  accessToken: z.string(),
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
