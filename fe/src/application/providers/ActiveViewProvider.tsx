import React, { PropsWithChildren, useCallback, useReducer } from 'react';
import { useLocation } from 'react-router-dom';
import {
  ActiveViewContext,
  SidebarWidget,
  SidebarWidgetsConfiguration,
  ViewConfiguration,
  ViewState,
} from '@/types/view';
import { normalizeBasePath } from '@/utils/path';
import { useAuth } from '@/hooks';
import FacetProvider from './FacetProvider';
import DrawerProvider from './DrawerProvider';

enum ViewStateActionType {
  CONFIGURE_VIEW,
  CONFIGURE_WIDGETS,
  EJECT_VIEW,
}

type ViewStateAction =
  | { type: ViewStateActionType.CONFIGURE_VIEW; config: ViewConfiguration }
  | {
      type: ViewStateActionType.CONFIGURE_WIDGETS;
      config: SidebarWidgetsConfiguration;
    }
  | { type: ViewStateActionType.EJECT_VIEW };

const initialViewState: ViewState = {
  key: null,
  title: null,
  sidebarPlacement: 'left',
  widgets: [],
  configureView: () => {},
  configureWidgets: () => {},
  ejectView: () => {},
};

const ActiveViewProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(viewStateReducer, initialViewState);
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const contextValue = {
    ...state,
    widgets: filterScopedWidgets(
      state.widgets,
      isAuthenticated,
      location.pathname
    ),
    configureView: useCallback(
      (config: ViewConfiguration) => {
        dispatch({ type: ViewStateActionType.CONFIGURE_VIEW, config });
      },
      [dispatch]
    ),
    configureWidgets: useCallback(
      (config: SidebarWidgetsConfiguration) => {
        dispatch({ type: ViewStateActionType.CONFIGURE_WIDGETS, config });
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
        <DrawerProvider>{children}</DrawerProvider>
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

    case ViewStateActionType.CONFIGURE_WIDGETS:
      return {
        ...state,
        widgets: mergeWidgetConfigurations(state.widgets, action.config),
      };

    case ViewStateActionType.EJECT_VIEW:
      return {
        ...initialViewState,
        sidebarPlacement: state.sidebarPlacement,
      };
  }
}

function mergeWidgetConfigurations(
  widgets: SidebarWidget[],
  config: SidebarWidgetsConfiguration
): SidebarWidget[] {
  let normalizedConfigs = Array.isArray(config)
    ? config
        .reverse()
        .filter(
          (value, index, array) =>
            Object.keys(value).length > 0 &&
            index === array.findIndex((item) => item.slot === value.slot)
        )
    : [config];

  if (normalizedConfigs.length === 0) return widgets;
  else {
    const updated = [
      ...widgets.filter(
        (item) =>
          normalizedConfigs.findIndex((value) => value.slot === item.slot) ===
          -1
      ),
      ...normalizedConfigs
        .filter((config) => !!config.component)
        .map(
          (config): SidebarWidget => ({
            slot: config.slot || 0,
            scope: config.scope,
            caption: config.caption || '',
            component: config.component,
          })
        ),
    ];

    return updated.sort(
      (a: SidebarWidget, b: SidebarWidget) => a.slot - b.slot
    );
  }
}

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
