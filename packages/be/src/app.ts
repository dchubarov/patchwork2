import express from 'express';
import pino from 'pino-http';
import { rootLogger } from './logging';

const app = express();

/* More options: https://www.npmjs.com/package/pino-http */
app.use(pino({ logger: rootLogger, useLevel: 'trace' }));

app.get('/server-info', async (_req, res) => {
  res.send('OK');
});

app.listen(5555, () => {
  rootLogger.info(`Server is running`);
});
