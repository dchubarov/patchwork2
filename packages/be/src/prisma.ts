import { createClient } from '@libsql/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { PrismaClient } from '@prisma/client';
import { env } from './env';

const libSql = createClient({
  url: env.DATABASE_URL,
});

const adapter = new PrismaLibSQL(libSql);
const prisma = new PrismaClient({ adapter });
