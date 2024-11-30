import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks';
import { ResourceAccessError } from '@/types/error';

const AuthorizedRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    throw new ResourceAccessError('Not authenticated');
  }

  return <Outlet />;
};

export default AuthorizedRoute;
