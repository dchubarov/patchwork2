import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth, useFacetOrNull } from '@/hooks';
import { ResourceAccessError } from '@/types/error';

const AuthorizedRoute: React.FC = () => {
  const facet = useFacetOrNull();
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    throw new ResourceAccessError('Not authenticated');
  }

  if (typeof facet?.authorization === 'function') {
    if (!facet.authorization(user))
      throw new ResourceAccessError(
        'You are not authorized to access this page'
      );
  }

  return <Outlet />;
};

export default AuthorizedRoute;
