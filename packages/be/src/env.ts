import { z } from 'zod';
import 'dotenv/config';

const envSchema = z.object({
  DATABASE_URL: z.string(),
  LISTEN_ADDRESS: z.string().default('127.0.0.1'),
  LISTEN_PORT: z.coerce.number().default(5555),
});

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
