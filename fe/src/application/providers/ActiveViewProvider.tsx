import React, { PropsWithChildren, useCallback, useReducer } from 'react';
import { ActiveViewContext, ViewConfiguration, ViewState } from '@/types/view';
import FacetProvider from './FacetProvider';
import DrawerProvider from './DrawerProvider';
import SidebarWidgetsProvider from './SidebarWidgetsProvider';

enum ViewStateActionType {
  CONFIGURE_VIEW,
  EJECT_VIEW,
}

type ViewStateAction =
  | { type: ViewStateActionType.CONFIGURE_VIEW; config: ViewConfiguration }
  | { type: ViewStateActionType.EJECT_VIEW };

const initialViewState: ViewState = {
  key: null,
  title: null,
  sidebarPlacement: 'left',
  configureView: () => {},
  ejectView: () => {},
};

const ActiveViewProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(viewStateReducer, initialViewState);

  const contextValue = {
    ...state,
    configureView: useCallback(
      (config: ViewConfiguration) => {
        dispatch({ type: ViewStateActionType.CONFIGURE_VIEW, config });
      },
      [dispatch]
    ),
    ejectView: useCallback(() => {
      dispatch({ type: ViewStateActionType.EJECT_VIEW });
    }, [dispatch]),
  };

  return (
    <FacetProvider>
      <ActiveViewContext.Provider value={contextValue}>
        <SidebarWidgetsProvider>
          <DrawerProvider>{children}</DrawerProvider>
        </SidebarWidgetsProvider>
      </ActiveViewContext.Provider>
    </FacetProvider>
  );
};

export default ActiveViewProvider;

// Private

export function viewStateReducer(
  state: ViewState,
  action: ViewStateAction
): ViewState {
  switch (action.type) {
    case ViewStateActionType.CONFIGURE_VIEW:
      return {
        ...state,
        ...action.config,
      };

    case ViewStateActionType.EJECT_VIEW:
      return {
        ...initialViewState,
        sidebarPlacement: state.sidebarPlacement,
      };
  }
}

/*
function filterScopedWidgets(
  widgets: SidebarWidget[],
  isAuthenticated: boolean,
  pathname: string
) {
  const filtered = widgets.filter((item) =>
    scopeMatches(item.scope, isAuthenticated, pathname)
  );
  return filtered.length !== widgets.length ? filtered : widgets;
}

function scopeMatches(
  scope: string | undefined,
  isAuthenticated: boolean,
  pathname: string
): boolean {
  if (typeof scope === 'undefined' || scope.length < 1) return true;

  let exactMatch = true,
    l = 0,
    r = scope.length;

  if (scope.startsWith('!')) {
    if (!isAuthenticated) return false;
    l++;
  }
  if (scope.endsWith('*')) {
    exactMatch = false;
    r--;
  }

  const normalizedPath = normalizeBasePath(scope.substring(l, r)) || '/';
  return exactMatch
    ? pathname === normalizedPath
    : pathname.startsWith(normalizedPath);
}
*/
