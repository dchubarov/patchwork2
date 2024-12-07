import { z } from 'zod';

export const serverInfoResponseSchema = z.object({
  server: z.string(),
  status: z.string(),
  timestamp: z.number(),
});

export type ServerInfoResponse = z.infer<typeof serverInfoResponseSchema>;
