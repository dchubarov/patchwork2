import { createClient } from '@libsql/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { PrismaClient } from '@prisma/client';
import { env } from './env';

const libSql = createClient({
  url: env.DATABASE_URL,

  // Embedded replica: https://docs.turso.tech/sdk/ts/reference#embedded-replicas
  // syncUrl: 'libsql://[databaseName]-[organizationName].turso.io',
  // authToken: '****',

  // Encryption: https://docs.turso.tech/sdk/ts/reference#encryption
  // encryptionKey: '****'
});

const adapter = new PrismaLibSQL(libSql);
export const prisma = new PrismaClient({ adapter });
