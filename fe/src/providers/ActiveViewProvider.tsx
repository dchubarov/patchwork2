import React, {createContext, PropsWithChildren, useCallback, useReducer} from "react";
import {initialViewState, ViewConfiguration, ViewState, WidgetsConfiguration} from "../lib/viewStateTypes";
import {ViewStateActionType, viewStateReducer} from "../lib/viewStateReducer";
import {Location, useLocation} from "react-router-dom";
import AppFeatures from "../features";

export const ActiveViewContext = createContext<ViewState | null>(null);

const ActiveViewProvider: React.FC<PropsWithChildren> = ({children}) => {
    const [state, dispatch] = useReducer(viewStateReducer, initialViewState);
    const location = useLocation();

    const contextValue = {
        ...state,
        ...getSectionInfoFromLocation(location),
        configureView: useCallback((config: ViewConfiguration) => {
            dispatch({type: ViewStateActionType.CONFIGURE_VIEW, config});
        }, [dispatch]),
        configureWidgets: useCallback((config: WidgetsConfiguration) => {
            dispatch({type: ViewStateActionType.CONFIGURE_WIDGETS, config});
        }, [dispatch]),
        ejectView: useCallback(() => {
            dispatch({type: ViewStateActionType.EJECT_VIEW});
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
        ? AppFeatures.find((feature) => feature.basename === first)
        : null;

    return {
        sectionKey: first || null,
        sectionTitle: feature?.displayName || null
    }
}
