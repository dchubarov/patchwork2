import React, { PropsWithChildren } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useAuth } from '@/hooks';
import { useLocation } from 'react-router-dom';

const ViewErrorBoundary: React.FC<PropsWithChildren> = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();

  // const handleError = (error: Error, info: ErrorInfo) => {};

  const boundaryKey = `${user?.username}@${location.pathname}`;
  return (
    <ErrorBoundary
      key={boundaryKey}
      // onError={handleError}
      fallback="TODO View error caught!">
      {children}
    </ErrorBoundary>
  );
};

export default ViewErrorBoundary;
