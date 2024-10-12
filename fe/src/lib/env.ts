export type ApplicationEnvironment = "development" | "production";
export type BackendStatus = "unknown" | "online" | "offline" /*| "maintenance"*/;

export interface EnvironmentState {
    environment: ApplicationEnvironment;
    versionInfo: string;
    backendInfo?: string;
    backendStatus: BackendStatus;
}

export enum EnvironmentStateActionType {
    UPDATE_BACKEND_STATUS
}

export type EnvironmentStateAction =
    | { type: EnvironmentStateActionType.UPDATE_BACKEND_STATUS, backendStatus: BackendStatus, backendInfo?: string }
    ;

export function environmentStateReducer(state: EnvironmentState, action: EnvironmentStateAction): EnvironmentState {
    switch (action.type) {
        case EnvironmentStateActionType.UPDATE_BACKEND_STATUS:
            return {
                ...state,
                backendStatus: action.backendStatus,
                backendInfo: action.backendInfo
            };
    }
}
