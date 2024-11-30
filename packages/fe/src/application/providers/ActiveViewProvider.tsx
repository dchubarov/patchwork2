import React, { PropsWithChildren, useEffect, useState } from 'react';
import { ActiveViewContext, scopeMatches, ViewState } from '@/types/view';
import DrawerProvider from './DrawerProvider';
import SidebarWidgetsProvider from './SidebarWidgetsProvider';
import { useLocation } from 'react-router-dom';
import { useAuth, useFacetOrNull } from '@/hooks';

const ActiveViewProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const facet = useFacetOrNull();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [state, setState] = useState(
    (): ViewState => ({
      sidebarPlacement: 'left',
      configureView: (config) =>
        setState((prev) => ({
          ...prev,
          ...config,
        })),
      ejectView: () =>
        setState((prev) => ({ ...prev, title: undefined, scope: undefined })),
    })
  );

  if (!scopeMatches(state.scope, location.pathname, isAuthenticated)) {
    state.ejectView();
  }

  useEffect(() => {
    let documentTitle = '';
    if (state.title) documentTitle += state.title + ' :: ';
    if (facet) documentTitle += facet.localizedDisplayName + ' :: ';
    documentTitle += 'Patchwork2';
    document.title = documentTitle;
  }, [state.title, facet]);

  return (
    <SidebarWidgetsProvider>
      <DrawerProvider>
        <ActiveViewContext.Provider value={state}>
          {children}
        </ActiveViewContext.Provider>
      </DrawerProvider>
    </SidebarWidgetsProvider>
  );
};

export default ActiveViewProvider;
