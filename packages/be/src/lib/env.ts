import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({
  path: ['.env.local', '.env'],
});

const envConfigSchema = z
  .object({
    DATABASE_URL: z.string(),
    DOMAIN: z.string().default('localhost'),
    CORS_ALLOWED_ORIGINS: z.string().default('*'),
    LISTEN_ADDRESS: z.string().default('127.0.0.1'),
    LISTEN_PORT: z.coerce.number().default(3000),
    LISTEN_PORT_HTTPS: z.coerce.number().optional(),
    LOG_LEVEL: z.string().default('info'),
  })
  .readonly();

type EnvConfig = z.infer<typeof envConfigSchema>;

function parseProcessEnvironment(): EnvConfig {
  const vars = Object.entries(process.env).reduce<
    Record<string, string | undefined>
  >((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {});

  const result = envConfigSchema.safeParse(vars);
  if (result.error) {
    throw new Error('Failed to create application environment', {
      cause: result.error,
    });
  }

  return result.data;
}

export const env: EnvConfig = parseProcessEnvironment();
