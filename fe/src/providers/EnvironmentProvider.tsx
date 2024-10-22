import React, {createContext, PropsWithChildren, useContext, useEffect, useReducer} from "react";
import {EnvironmentState, EnvironmentStateActionType, environmentStateReducer} from "../lib/env";
import version from "../version.json";
import useCall from "../lib/useCall";

export const EnvironmentContext = createContext<EnvironmentState | null>(null);

export function useEnvironment(): EnvironmentState {
    const context = useContext(EnvironmentContext);
    if (!context) {
        throw new Error("useEnvironment hook should be used within EnvironmentProvider.")
    }
    return context;
}

const initialEnvironmentState: EnvironmentState = {
    environment: (process.env.REACT_APP_ENV === "development" || process.env.REACT_APP_ENV === "production") ?
        process.env.REACT_APP_ENV : "production",
    versionInfo: "Version " + version.number,
    backendStatus: "unknown",
}

const EnvironmentProvider: React.FC<PropsWithChildren> = ({children}) => {
    const [state, dispatch] = useReducer(environmentStateReducer, initialEnvironmentState);
    const {execute: refreshBackendInfo} = useCall({path: "server-info"}, false,
        (data) => dispatch({type: EnvironmentStateActionType.UPDATE_BACKEND_STATUS, backendStatus: "online", backendInfo: data.server}),
        () => dispatch({type: EnvironmentStateActionType.UPDATE_BACKEND_STATUS, backendStatus: "offline"}));

    useEffect(() => {
        const timer = setInterval(() => {
            refreshBackendInfo();
        }, 30000);

        return () => {
            clearInterval(timer);
        }
    }, [refreshBackendInfo]);

    return (
        <EnvironmentContext.Provider value={state}>
            {children}
        </EnvironmentContext.Provider>
    );
}

export default EnvironmentProvider;
