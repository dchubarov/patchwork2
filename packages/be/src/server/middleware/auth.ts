import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { userSchema } from '@patchwork2/schema';
import { RequestProcessingError } from '../../lib/error';
import { verifyToken } from '../../lib/encrypt';
import { userRepository } from '../../orm';
import { transformUser } from '../../lib/transform';

const required =
  () => async (req: Request, _: Response, next: NextFunction) => {
    const header = req.header('authorization');
    if (!header || !header.startsWith('Bearer')) {
      next(new RequestProcessingError('No access token supplied', 401));
      return;
    }

    let jwt: JwtPayload | undefined;
    let caught;
    try {
      jwt = verifyToken(header.substring(6).trimStart());
    } catch (err) {
      caught = err;
    }

    if (!jwt || !jwt.sub || !jwt.sub.startsWith('user:')) {
      next(new RequestProcessingError('Invalid access token', 401, caught));
      return;
    }

    const userId = jwt.sub.substring(5);
    const dbUser = await userRepository.findById(userId);
    if (!dbUser || dbUser.status !== 'active') {
      next(new RequestProcessingError('Invalid user', 401));
      return;
    }

    req.user = userSchema.parse(transformUser(dbUser));
    next();
  };

const auth = {
  required,
};

export default auth;
