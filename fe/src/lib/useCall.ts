import React, {useEffect, useState} from "react";
import axios, {AxiosResponse, Method} from "axios";
import {logger} from "./logging";

export interface RequestData<D = any> {
    params?: any;
    data?: D;
}

export type Endpoint<D = any> = {
    path: string;
    method?: string;
} & RequestData<D>;

export type CallStatus = "initial" | "loading" | "success" | "failure";

interface CallResult<D, R> {
    status: CallStatus;
    data?: R;
    error?: any;
    elapsedMillis?: number;
    execute: (request?: RequestData<D>) => void;
}

enum LifecyclePhase {
    IDLE,
    INITIATED,
    RUNNING
}

interface RequestLifecycle<D> {
    phase: LifecyclePhase;
    endpoint: Endpoint<D>;
}

export default function useCall<D = any, R = any>(
    endpoint: Endpoint<D>,
    start: boolean = false,
    onSuccess?: (data: R) => void,
    onError?: (error: any) => void,
): CallResult<D, R> {
    const [requestLifecycle, setRequestLifecycle] = useState<RequestLifecycle<D>>({
        phase: start ? LifecyclePhase.INITIATED : LifecyclePhase.IDLE,
        endpoint: endpoint
    });

    const [result, setResult] = useState<CallResult<D, R>>({
        status: "initial",
        elapsedMillis: NaN,
        execute: (request) => {
            setRequestLifecycle((prev) => {
                if (prev.phase !== LifecyclePhase.IDLE) {
                    // TODO it is obviously not enough to log a warning.
                    logger.warn("Request is already running.");
                    return prev;
                }
                return {
                    ...prev,
                    phase: LifecyclePhase.INITIATED,
                    endpoint: {
                        ...prev.endpoint,
                        params: request?.params,
                        data: request?.data
                    }
                }
            });
        }
    });

    useEffect(() => {
        if (requestLifecycle.phase === LifecyclePhase.INITIATED) {
            setRequestLifecycle((prev) => ({...prev, phase: LifecyclePhase.RUNNING}));
            executeRequest(requestLifecycle.endpoint, setResult, () => {
                setRequestLifecycle((prev) => ({
                    ...prev,
                    phase: LifecyclePhase.IDLE,
                    //TODO: restore original endpoint?
                    //endpoint: endpoint,
                }));
            }, onSuccess, onError);
        }
    }, [requestLifecycle, onSuccess, onError]);

    return result;
}

// private

function executeRequest<D, R>(
    endpoint: Endpoint<D>,
    dispatch: React.Dispatch<React.SetStateAction<CallResult<D, R>>>,
    finalizer: () => void,
    onSuccess?: (data: R) => void,
    onError?: (error: any) => void
) {
    dispatch((prev) => ({...prev, status: "loading"}));

    const start = performance.now();
    axios.request<R, AxiosResponse<R>, D>({
        url: process.env.REACT_APP_API_ROOT + "/" + endpoint.path,
        method: (endpoint.method as Method) || (endpoint.data ? "POST" : "GET"),
        params: endpoint.params,
        data: endpoint.data
    })
        .then((response) => {
            onSuccess?.(response.data);
            dispatch((prev) => ({
                ...prev,
                status: "success",
                data: response.data,
                elapsedMillis: Math.round(performance.now() - start),
            }));
        })
        .catch((reason) => {
            onError?.(reason);
            dispatch((prev) => ({
                ...prev,
                status: "failure",
                error: transformErrorResponse(reason),
                elapsedMillis: Math.round(performance.now() - start),
            }));
        })
        .finally(finalizer);
}

function transformErrorResponse(reason: any) {
    return reason;
}
