import { Router } from 'express';

const controller = Router();

/**
 * Get server info.
 */
controller.get('/server-info', (_, res) => {
  res.send({
    server: 'Butterfly NodeJS/Express',
    status: 'operational',
    timestamp: Date.now(),
  });
});

export default controller;
