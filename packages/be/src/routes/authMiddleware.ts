import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../encrypt';
import { RequestProcessingError } from '../error';
import { JwtPayload } from 'jsonwebtoken';
import { User } from '@prisma/client';
import prisma from '../prisma';
import { userSchema } from '@patchwork2/shared';

const required =
  () => async (req: Request, _: Response, next: NextFunction) => {
    const header = req.header('authorization');
    if (!header || !header.startsWith('Bearer:')) {
      next(new RequestProcessingError('No access token supplied', 401));
      return;
    }

    let jwt: JwtPayload | undefined;
    let caught;
    try {
      jwt = verifyToken(header.substring(7).trimStart());
    } catch (err) {
      caught = err;
    }

    if (!jwt || !jwt.sub || !jwt.sub.startsWith('user:')) {
      next(new RequestProcessingError('Invalid access token', 401, caught));
      return;
    }

    const userId = parseInt(jwt.sub.substring(5));
    const dbUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!dbUser || dbUser.status !== 'active') {
      next(new RequestProcessingError('Invalid user', 401));
      return;
    }

    req.user = userSchema.parse(transformUser(dbUser));
    next();
  };

export const transformUser = (dbUser: User) => ({
  ...dbUser,
  roles: dbUser.roles
    ? dbUser.roles
        .split(',')
        .map((value) => value.trim())
        .filter((value) => value !== '')
    : [],
});

const auth = {
  required,
};

export default auth;
