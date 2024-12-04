import { createClient } from '@libsql/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { PrismaClient } from '@prisma/client';
import { rootLogger } from './logging';
import { env } from './env';

const logger = rootLogger.child({ name: 'Prisma' });

const libSql = createClient({
  url: env.DATABASE_URL,

  // Embedded replica: https://docs.turso.tech/sdk/ts/reference#embedded-replicas
  // syncUrl: 'libsql://[databaseName]-[organizationName].turso.io',
  // authToken: '****',

  // Encryption: https://docs.turso.tech/sdk/ts/reference#encryption
  // encryptionKey: '****'
});

const adapter = new PrismaLibSQL(libSql);

const prisma = new PrismaClient({ adapter }).$extends({
  name: 'query-logging',
  query: {
    $allModels: {
      $allOperations: async ({ operation, model, args, query }) => {
        const start = performance.now();
        let result = null;
        let error = null;
        try {
          result = await query(args);
          return result;
        } catch (err) {
          error = err;
          throw err;
        } finally {
          const duration =
            Math.trunc((performance.now() - start) * 1000) / 1000;
          logger.debug(
            { args, result, error, ...logger.bindings() },
            `completed ${model}.${operation} in ${duration}ms`
          );
        }
      },
    },
  },
});

export default prisma;
