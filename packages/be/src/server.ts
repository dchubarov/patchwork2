import express from 'express';
import pino from 'pino-http';
import { rootLogger } from './logging';
import { env } from './env';

const app = express();

/* More options: https://www.npmjs.com/package/pino-http */
app.use(pino({ logger: rootLogger, useLevel: 'trace' }));

app.get('/server-info', async (_req, res) => {
  res.send('OK');
});

app.listen(env.LISTEN_PORT, env.LISTEN_ADDRESS, () => {
  rootLogger.info(
    `Server is running at ${env.LISTEN_ADDRESS}:${env.LISTEN_PORT}`
  );
});
