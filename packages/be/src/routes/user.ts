import { Router } from 'express';
import { userSchema } from '@patchwork2/shared';
import { handleCatching, RequestProcessingError } from '../error';
import prisma from '../prisma';
import { transformUser } from './auth';

const controller = Router();

controller.get(
  '/:userId',
  handleCatching(async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (!userId) throw new RequestProcessingError('Invalid user id', 400);

    const dbUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!dbUser) throw new RequestProcessingError('User not found', 404);

    res.status(200).send({ user: userSchema.parse(transformUser(dbUser)) });
  })
);

export default Router().use('/user', controller);
