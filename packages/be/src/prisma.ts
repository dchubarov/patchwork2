import { createClient } from '@libsql/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { PrismaClient } from '@prisma/client';

const libSql = createClient({
  url: process.env.DATABASE_URL ?? 'file:./dev.db',
});

const adapter = new PrismaLibSQL(libSql);
const prisma = new PrismaClient({ adapter });
