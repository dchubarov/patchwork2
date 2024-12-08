import { PrismaClient } from '@prisma/client';
import * as readlineSync from 'readline-sync';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const BCRYPT_SALT_ROUNDS = 10;

async function main() {
  const pwd = readlineSync.question('Initial user password: ', {
    hideEchoBack: true,
  });

  let hashedPassword = await bcrypt.hash(pwd, BCRYPT_SALT_ROUNDS);
  await prisma.user.createMany({
    data: [
      {
        username: 'rabbit',
        email: `admin@`,
        password: hashedPassword,
        roles: 'admin',
      },
      {
        // TODO remove this user when sso signup is available
        username: 'dime',
        email: 'dime@twowls.org',
        password: hashedPassword,
        roles: 'admin,developer',
      },
    ],
  });
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
