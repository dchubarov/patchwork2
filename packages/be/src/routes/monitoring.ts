import { Router } from 'express';

const router = Router();

/**
 * Get server info.
 */
router.get('/server-info', (_, res) => {
  res.send({
    server: 'Butterfly NodeJS/Express',
    status: 'operational',
    timestamp: Date.now(),
  });
});

export default router;
