import {AxiosInstance} from "axios";
import {createContext} from "react";

export type ApplicationEnvironment = "development" | "production";
export type BackendStatus = "unknown" | "online" | "offline" /*| "maintenance"*/;

export interface EnvironmentState {
    environment: ApplicationEnvironment;
    apiClient: AxiosInstance;
    versionInfo: string;
    backendInfo?: string;
    backendStatus: BackendStatus;
}

export const EnvironmentContext = createContext<EnvironmentState | null>(null);
