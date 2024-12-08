import { Router } from 'express';
import { userSchema } from '@patchwork2/schema';
import { handleCatching, RequestProcessingError } from '../../lib/error';
import { userRepository } from '../../orm';
import auth from '../middleware/auth';
import { transformUser } from '../../lib/transform';

const controller = Router();

controller.get(
  '/:userId',
  auth.required(),
  handleCatching(async (req, res) => {
    const userId = req.params.userId;
    if (!userId) throw new RequestProcessingError('Invalid user id', 400);

    let user;
    if (userId === req.user?.id) user = req.user;
    else {
      const dbUser = await userRepository.findById(userId);
      if (!dbUser) throw new RequestProcessingError('User not found', 404);
      user = userSchema.parse(transformUser(dbUser));
    }
    res.status(200).send({ user });
  })
);

export default Router().use('/user', controller);
