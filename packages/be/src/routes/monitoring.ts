import { Router } from 'express';

const router = Router();

/**
 * Get server info.
 */
router.get('/server-info', (_, res) => {
  res.send({ status: 'OK' });
});

export default router;
