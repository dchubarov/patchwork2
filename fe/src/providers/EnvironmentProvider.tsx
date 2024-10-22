import React, {createContext, PropsWithChildren, useContext, useReducer} from "react";
import {useQuery} from "@tanstack/react-query";
import {EnvironmentState, EnvironmentStateActionType, environmentStateReducer} from "../lib/env";
import apiClient, {apiUrl} from "../lib/apiClient";
import version from "../version.json";

export const EnvironmentContext = createContext<EnvironmentState | null>(null);

export function useEnvironment(): EnvironmentState {
    const context = useContext(EnvironmentContext);
    if (!context) {
        throw new Error("useEnvironment() hook should be used within EnvironmentProvider.")
    }
    return context;
}

const initialEnvironmentState: EnvironmentState = {
    environment: (process.env.REACT_APP_ENV === "development" || process.env.REACT_APP_ENV === "production") ?
        process.env.REACT_APP_ENV : "production",
    versionInfo: "Version " + version.number,
    backendStatus: "unknown",
}

const MONITORING_INTERVAL_MILLIS = 30_000;

const EnvironmentProvider: React.FC<PropsWithChildren> = ({children}) => {
    const [state, dispatch] = useReducer(environmentStateReducer, initialEnvironmentState);
    useQuery({
        queryKey: ["/server-info"],
        queryFn: async () => {
            return apiClient
                .get(apiUrl("/server-info"))
                .then((response => response.data))
                .then((data) => {
                    dispatch({
                        type: EnvironmentStateActionType.UPDATE_BACKEND_STATUS,
                        backendStatus: "online",
                        backendInfo: data.server
                    });
                    return data;
                })
                .catch(() => {
                    dispatch({
                        type: EnvironmentStateActionType.UPDATE_BACKEND_STATUS,
                        backendStatus: "offline"
                    });
                    return null;
                });
        },
        refetchInterval: MONITORING_INTERVAL_MILLIS,
        staleTime: 0
    });

    return (
        <EnvironmentContext.Provider value={state}>
            {children}
        </EnvironmentContext.Provider>
    );
}

export default EnvironmentProvider;
