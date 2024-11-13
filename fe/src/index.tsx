import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import { envGlobals } from '@/types/env';
import { logger } from '@/utils/logging';
import createQueryClient from './application/utils/queryClient';
import { buildRouter } from './application/utils/routing';
import EnvironmentProvider from './application/providers/EnvironmentProvider';
import AuthProvider from './application/providers/AuthProvider';
import { App, DefaultPage, ErrorPage } from './application';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <QueryClientProvider client={createQueryClient()}>
      <EnvironmentProvider>
        <AuthProvider>
          <RouterProvider
            router={buildRouter(<App />, <ErrorPage />, <DefaultPage />)}
          />
        </AuthProvider>
      </EnvironmentProvider>
    </QueryClientProvider>
  </StrictMode>
);

if (envGlobals.ENABLE_MOCKER) {
  require('./mocker');
  logger.log('Installed backend mocker (MirageJS).');
}

reportWebVitals(/*console.log*/);
