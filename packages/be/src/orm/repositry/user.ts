import { User } from '@prisma/client';
import prisma from '../client';

export const findById = async (
  userId?: string | number
): Promise<User | null> => {
  if (!userId) return null;
  else if (typeof userId === 'string') userId = parseInt(userId);
  return await prisma.user.findUnique({
    where: { id: userId },
  });
};

export const findByLogin = async (login: string): Promise<User | null> => {
  return await prisma.user.findFirst({
    where: {
      OR: [{ username: login }, { email: login }],
    },
  });
};
