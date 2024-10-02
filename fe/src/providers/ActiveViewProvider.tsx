import React, {createContext, PropsWithChildren, useCallback, useReducer} from "react";
import {initialViewState, ViewConfiguration, ViewState, WidgetsConfiguration} from "../lib/viewStateTypes";
import {ViewStateActionType, viewStateReducer} from "../lib/viewStateReducer";

export const ActiveViewContext = createContext<ViewState | null>(null);

const ActiveViewProvider: React.FC<PropsWithChildren> = ({children}) => {
    const [state, dispatch] = useReducer(viewStateReducer, initialViewState);

    const contextValue = {
        ...state,
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
