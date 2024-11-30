import { rootLogger } from './logging';

process.on('uncaughtException', (error, origin) => {
  rootLogger.error(
    error,
    origin === 'uncaughtException'
      ? 'Uncaught exception'
      : 'Unhandled rejection'
  );
});

import './server';
