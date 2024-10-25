import {AxiosInstance} from "axios";

export type ApplicationEnvironment = "development" | "production";
export type BackendStatus = "unknown" | "online" | "offline" /*| "maintenance"*/;

export interface EnvironmentState {
    environment: ApplicationEnvironment;
    apiClient: AxiosInstance;
    versionInfo: string;
    backendInfo?: string;
    backendStatus: BackendStatus;
}
