import express from 'express';
import pino from 'pino-http';
import { rootLogger } from '../lib/logging';
import { errorHandler } from '../lib/error';
import { env } from '../lib/env';
import routes from './routes';
import https from 'https';
import http from 'http';
import { tlsCredentials } from '../lib/encrypt';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

/* More options: https://www.npmjs.com/package/pino-http */
app.use(pino({ logger: rootLogger, useLevel: 'trace' }));
app.use(
  cors({
    origin: env.CORS_ALLOWED_ORIGINS,
    credentials: true,
  })
);
//app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(routes);
app.use(errorHandler);

if (env.LISTEN_PORT_HTTPS) {
  https
    .createServer({ ...tlsCredentials() }, app)
    .listen(env.LISTEN_PORT_HTTPS, env.LISTEN_ADDRESS, () => {
      rootLogger.info(
        `Server is listening at ${env.LISTEN_ADDRESS}:${env?.LISTEN_PORT_HTTPS}/https`
      );
    });
}

http.createServer(app).listen(env.LISTEN_PORT, env.LISTEN_ADDRESS, () => {
  rootLogger.info(
    `Server is listening at ${env.LISTEN_ADDRESS}:${env?.LISTEN_PORT}/http`
  );
});
