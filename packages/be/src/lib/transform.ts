import { User } from '@prisma/client';

export const transformUser = (dbUser: User) => ({
  ...dbUser,
  roles: dbUser.roles
    ? dbUser.roles
        .split(',')
        .map((value) => value.trim())
        .filter((value) => value !== '')
    : [],
});
