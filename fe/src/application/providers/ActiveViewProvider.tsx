import React, {PropsWithChildren, ReactNode, useCallback, useReducer} from "react";
import {Location, useLocation} from "react-router-dom";
import {
    ActiveViewContext,
    initialViewState,
    SidebarWidget,
    SidebarWidgetsConfiguration,
    ViewConfiguration,
    ViewState
} from "@/types/viewTypes";
import AppFeatures from "@/features";

enum ViewStateActionType {
    CONFIGURE_VIEW,
    CONFIGURE_WIDGETS,
    EJECT_VIEW,
    OPEN_DRAWER,
    CLOSE_DRAWER
}

type ViewStateAction =
    | { type: ViewStateActionType.CONFIGURE_VIEW, config: ViewConfiguration }
    | { type: ViewStateActionType.CONFIGURE_WIDGETS, config: SidebarWidgetsConfiguration }
    | { type: ViewStateActionType.EJECT_VIEW }
    | { type: ViewStateActionType.OPEN_DRAWER, component: ReactNode, title?: string }
    | { type: ViewStateActionType.CLOSE_DRAWER }

const ActiveViewProvider: React.FC<PropsWithChildren> = ({children}) => {
    const [state, dispatch] = useReducer(viewStateReducer, initialViewState);
    const location = useLocation();

    const contextValue = {
        ...state,
        ...getSectionInfoFromLocation(location),
        configureView: useCallback((config: ViewConfiguration) => {
            dispatch({type: ViewStateActionType.CONFIGURE_VIEW, config});
        }, [dispatch]),
        configureWidgets: useCallback((config: SidebarWidgetsConfiguration) => {
            dispatch({type: ViewStateActionType.CONFIGURE_WIDGETS, config});
        }, [dispatch]),
        ejectView: useCallback(() => {
            dispatch({type: ViewStateActionType.EJECT_VIEW});
        }, [dispatch]),
        openDrawer: useCallback((component: ReactNode, title?: string) => {
            dispatch({type: ViewStateActionType.OPEN_DRAWER, component, title});
        }, [dispatch]),
        closeDrawer: useCallback(() => {
            dispatch({type: ViewStateActionType.CLOSE_DRAWER});
        }, [dispatch])
    }

    return (
        <ActiveViewContext.Provider value={contextValue}>
            {children}
        </ActiveViewContext.Provider>
    );
}

export default ActiveViewProvider;

// private

function getSectionInfoFromLocation(location: Location) {
    const first = location.pathname.split("/").find((value) => value !== "");
    const feature = first
        ? AppFeatures.find((feature) => feature.basePath ? feature.basePath === first : feature.name === first)
        : null;

    return {
        sectionKey: first || null,
        sectionTitle: feature?.defaultDisplayName || null
    }
}

export function viewStateReducer(state: ViewState, action: ViewStateAction): ViewState {
    switch (action.type) {
        case ViewStateActionType.CONFIGURE_VIEW:
            return {
                ...state,
                ...action.config
            };

        case ViewStateActionType.CONFIGURE_WIDGETS:
            return {
                ...state,
                widgets: mergeWidgetConfigurations(state.widgets, action.config)
            };

        case ViewStateActionType.EJECT_VIEW:
            return {
                ...initialViewState,
                sidebarPlacement: state.sidebarPlacement
            };

        case ViewStateActionType.OPEN_DRAWER:
            return {
                ...state,
                drawerOpen: true,
                drawerTitle: action.title,
                drawerComponent: action.component
            }

        case ViewStateActionType.CLOSE_DRAWER:
            return {
                ...state,
                drawerOpen: false,
                drawerTitle: undefined,
                drawerComponent: null
            }
    }
}

function mergeWidgetConfigurations(widgets: SidebarWidget[], config: SidebarWidgetsConfiguration): SidebarWidget[] {
    let normalizedConfigs = Array.isArray(config)
        ? config.reverse().filter(
            (value, index, array) =>
                Object.keys(value).length > 0 &&
                index === array.findIndex((item) => item.slot === value.slot)
        )
        : [config];

    if (normalizedConfigs.length === 0)
        return widgets;
    else {
        const updated = [
            ...widgets
                .filter((item) => normalizedConfigs.findIndex((value) =>
                    value.slot === item.slot) === -1
                ),
            ...normalizedConfigs
                .filter((config) => config.component !== undefined)
                .map((config): SidebarWidget => ({
                    key: config.key || `widget-${config.slot || 0}`,
                    caption: config.caption || "",
                    slot: config.slot || 0,
                    component: config.component
                }))
        ];

        return updated.sort((a: SidebarWidget, b: SidebarWidget) => a.slot - b.slot);
    }
}
