import _ from 'lodash';
import React, { PropsWithChildren, useState } from 'react';
import {
  scopeMatches,
  SidebarWidget,
  SidebarWidgetsConfiguration,
  SidebarWidgetsContext,
  SidebarWidgetsState,
} from '@/types/view';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks';

const SidebarWidgetsProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [state, setState] = useState(
    (): SidebarWidgetsState => ({
      widgets: [],

      configureWidgets: (config) =>
        setState((prev) => {
          const widgets = mergeWidgetConfigurations(prev.widgets, config);
          if (widgets === prev.widgets) return prev;
          return { ...prev, widgets };
        }),

      removeWidgets: (...slots) =>
        setState((prev) => {
          const widgets = prev.widgets.filter((e) => !slots.includes(e.slot));
          if (widgets.length === prev.widgets.length) return prev;
          return { ...prev, widgets };
        }),

      removeAllWidgets: () =>
        setState((prev) => {
          if (prev.widgets.length === 0) return prev;
          return { ...prev, widgets: [] };
        }),
    })
  );

  // remove widgets whose scope does not match current context
  const filteredWidgets = state.widgets.filter((e) =>
    scopeMatches(e.scope, location.pathname, isAuthenticated)
  );
  if (state.widgets.length !== filteredWidgets.length) {
    setState((prev) => ({ ...prev, widgets: filteredWidgets }));
  }

  return (
    <SidebarWidgetsContext.Provider value={state}>
      {children}
    </SidebarWidgetsContext.Provider>
  );
};

export default SidebarWidgetsProvider;

// Private

function mergeWidgetConfigurations(
  previousWidgets: SidebarWidget[],
  config: SidebarWidgetsConfiguration
): SidebarWidget[] {
  if (Array.isArray(config) && config.length === 0) {
    return previousWidgets;
  }

  const widgetMap = previousWidgets.reduce(
    (acc, widget) => acc.set(widget.slot, widget),
    new Map<number, SidebarWidget>()
  );

  let changed = false;
  (Array.isArray(config) ? config : [config]).forEach((cfg) => {
    const slot = cfg.slot ?? 0;
    if (cfg.component) {
      const prev = widgetMap.get(slot);
      const next: SidebarWidget = {
        slot,
        scope: cfg.scope,
        component: cfg.component,
        caption: cfg.caption ?? `Widget ${slot}`,
      };

      if (!prev || !_.isEqual(prev, next)) {
        widgetMap.set(slot, next);
        changed = true;
      }
    } else {
      changed = widgetMap.delete(slot);
    }
  });

  return changed
    ? Array.from(widgetMap.values()).sort((w1, w2) => w1.slot - w2.slot)
    : previousWidgets;
}
