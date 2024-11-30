import React from 'react';
import { useRouteError } from 'react-router-dom';
import { CssBaseline, CssVarsProvider } from '@mui/joy';
import ErrorFallback from '../components/ErrorFallback';

const ErrorPage: React.FC = () => {
  const error = useRouteError();
  return (
    <CssVarsProvider>
      <CssBaseline />
      <ErrorFallback reason={error} />
    </CssVarsProvider>
  );
};

export default ErrorPage;
