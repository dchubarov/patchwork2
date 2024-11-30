import React, { PropsWithChildren } from 'react';
import { FacetContext } from '@/types/view';
import { useLocation } from 'react-router-dom';
import { useEnvironment } from '@/hooks';

const FacetProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { availableFacets } = useEnvironment();
  const location = useLocation();
  const facet =
    availableFacets.find((value) =>
      location.pathname.startsWith(value.basePath)
    ) ?? null;

  return (
    <FacetContext.Provider value={facet}>{children}</FacetContext.Provider>
  );
};

export default FacetProvider;
