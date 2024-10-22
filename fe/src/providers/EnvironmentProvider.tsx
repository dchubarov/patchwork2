import React, {createContext, PropsWithChildren, useContext, useEffect, useReducer} from "react";
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

const SERVER_MONITORING_INTERVAL_MILLIS = 30_000;

const EnvironmentProvider: React.FC<PropsWithChildren> = ({children}) => {
    const [state, dispatch] = useReducer(environmentStateReducer, initialEnvironmentState);

    // Backend monitoring
    const {status: serverInfoStatus, data: serverInfo} = useQuery({
        queryKey: ["/server-info"],
        queryFn: async () => {
            return apiClient
                .get(apiUrl("/server-info"))
                .then((response => response.data))
        },
        refetchInterval: SERVER_MONITORING_INTERVAL_MILLIS,
        staleTime: SERVER_MONITORING_INTERVAL_MILLIS
    });

    useEffect(() => {
        if (serverInfoStatus === "success") {
            dispatch({
                type: EnvironmentStateActionType.UPDATE_BACKEND_STATUS,
                backendInfo: serverInfo.server,
                backendStatus: "online"
            });
        } else if (serverInfoStatus === "error") {
            dispatch({
                type: EnvironmentStateActionType.UPDATE_BACKEND_STATUS,
                backendStatus: "offline"
            });
        }
    }, [serverInfoStatus, serverInfo]);

    return (
        <EnvironmentContext.Provider value={state}>
            {children}
        </EnvironmentContext.Provider>
    );
}

export default EnvironmentProvider;
