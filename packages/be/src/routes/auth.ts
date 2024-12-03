import { Router } from 'express';
import { prisma } from '../prisma';

const router = Router();

/**
 * Refresh access token based on refresh token (secure cookie).
 */
router.get('/refresh', (_, res) => {
  res.send('OK');
});

/**
 * Login with credentials.
 */
router.get('/login', async (req, res) => {
  const login = req.query['name'];
  if (typeof login !== 'string') {
    res.send('X');
    return;
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ username: login }, { email: login }],
    },
  });

  if (user) res.send(`OK:${user?.id}`);
  else res.send('XX');
});

/**
 * Logout current user.
 */
router.get('/logout', (_, res) => {
  res.send('OK');
});

export default Router().use('/auth', router);
