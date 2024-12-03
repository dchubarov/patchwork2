import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: 'dime@twowls.org' },
    update: {},
    create: {
      email: 'dime@twowls.org',
      username: 'dime',
      firstname: 'Dmitry',
    },
  });
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
