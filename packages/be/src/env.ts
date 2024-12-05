import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({
  path: ['.env.local', '.env'],
});

const envSchema = z
  .object({
    DATABASE_URL: z.string(),
    LISTEN_ADDRESS: z.string().default('127.0.0.1'),
    LISTEN_PORT: z.coerce.number().default(3000),
    LISTEN_PORT_HTTPS: z.coerce.number().optional(),
    LOG_LEVEL: z.string().default('info'),
  })
  .readonly();

function parseProcessEnvironment() {
  const vars = Object.entries(process.env).reduce<
    Record<string, string | undefined>
  >((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {});

  const result = envSchema.safeParse(vars);
  if (result.error) {
    throw new Error('Failed to create application environment', {
      cause: result.error,
    });
  }

  return result.data;
}

export const env = parseProcessEnvironment();
