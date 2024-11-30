import React, { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { useAuth } from '@/hooks';
import SuspenseFallback from '@/components/SuspenseFallback';
import ErrorFallback from './ErrorFallback';

const ActiveViewBoundary: React.FC = () => {
  const { reset: resetQueryError } = useQueryErrorResetBoundary();
  const location = useLocation();
  const { user } = useAuth();

  // Automatically resets error boundary when location or user changes
  const errorBoundaryKey = `${user?.username}@${location.pathname}`;

  return (
    <ErrorBoundary
      key={errorBoundaryKey}
      onReset={resetQueryError}
      fallbackRender={({ error, resetErrorBoundary }) => (
        <ErrorFallback reason={error} reset={resetErrorBoundary} />
      )}>
      <Suspense fallback={<SuspenseFallback />}>
        <Outlet />
      </Suspense>
    </ErrorBoundary>
  );
};

export default ActiveViewBoundary;
