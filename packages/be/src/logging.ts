import pino from 'pino';
import { env } from './env';

export const rootLogger = pino({
  level: env.LOG_LEVEL,
});
