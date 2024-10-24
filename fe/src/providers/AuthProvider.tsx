import _ from "lodash";
import React, {createContext, PropsWithChildren, useContext, useEffect, useRef, useState} from "react";
import {AxiosError, AxiosInstance, AxiosResponse} from "axios";
import {useMutation} from "@tanstack/react-query";
import {decodeJwt} from "../lib/jwt";
import {apiUrl} from "../lib/apiClient";
import {AuthState, LoginResponse, UserCredentials} from "../lib/auth";
import {useApiClient} from "./EnvironmentProvider";

const MAX_REFRESH_RETRY_COUNT = 3;
const INITIAL_REFRESH_DELAY_MILLIS = 15;

const refreshRequest = (client: AxiosInstance) =>
    async () => client
        .get<LoginResponse>(apiUrl("auth", "refresh"), {withCredentials: true})
        .then(response => response.data);

const loginRequest = (client: AxiosInstance) =>
    async (credentials: UserCredentials) => client
        .post<LoginResponse, AxiosResponse<LoginResponse>, UserCredentials>(apiUrl("auth", "login"), credentials)
        .then(response => response.data);

const logoutRequest = (client: AxiosInstance) =>
    async () => client
        .get(apiUrl("auth", "logout"));

const AuthContext = createContext<AuthState | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error("useAuth() hook must be used within AuthProvider.")
    }
    return context;
}

const AuthProvider: React.FC<PropsWithChildren> = ({children}) => {
    const apiClient = useApiClient();
    const accessTokenRef = useRef<string | null>(null);
    const requestInterceptorRef = useRef<number | null>(null);
    const [tokenExpiresMillis, setTokenExpiresMillis] = useState<number | null>(0); // causes immediate refresh attempt

    const handleSuccessfulLogin = (data: LoginResponse) => {
        if (data.accessToken) {
            accessTokenRef.current = data.accessToken;
            const jwt = decodeJwt(data.accessToken);
            setTokenExpiresMillis(jwt.exp * 1000);
        }

        setContext(prev => ({
            ...prev,
            user: (prev.user && _.isEqual(prev.user, data.user)) ? prev.user : data.user,
            isAuthenticated: true,
            isPending: false,
        }));

        if (requestInterceptorRef.current === null) {
            requestInterceptorRef.current = apiClient.interceptors.request.use(
                (config) => {
                    config.headers.Authorization = `Bearer: ${accessTokenRef.current}`;
                    return config;
                },
                (error) => {
                    return Promise.reject(error);
                });
        }
    }

    const handleLogout = () => {
        accessTokenRef.current = null;
        setTokenExpiresMillis(null);
        setContext(prev => ({
            ...prev,
            user: null,
            isAuthenticated: false,
            isPending: false,
        }));

        if (requestInterceptorRef.current !== null) {
            apiClient.interceptors.request.eject(requestInterceptorRef.current);
            requestInterceptorRef.current = null;
        }
    }

    const shouldRetryRefreshAttempt = (failureCount: number, error: Error): boolean => {
        // Error 404 excluded for now since if mock backend isn't ready yet, it will return 404, so we need to retry.
        if (error instanceof AxiosError && [-1, 400, 401/*, 404*/].includes(error.status || -1)) {
            return false;
        }
        return (failureCount < MAX_REFRESH_RETRY_COUNT);
    }

    const setPendingState = () => {
        setContext(prev => ({
            ...prev,
            isPending: true
        }));
    }

    const {mutate: doRefresh} = useMutation({
        mutationKey: ["auth/refresh"],
        mutationFn: refreshRequest(apiClient),
        onMutate: setPendingState,
        onSuccess: handleSuccessfulLogin,
        onError: handleLogout,
        retry: shouldRetryRefreshAttempt,
        gcTime: 0,
    });

    const {mutate: doLogin} = useMutation({
        mutationKey: ["auth/login"],
        mutationFn: loginRequest(apiClient),
        onMutate: setPendingState,
        onSuccess: handleSuccessfulLogin,
        onError: handleLogout,
        gcTime: 0,
    });

    const {mutate: doLogout} = useMutation({
        mutationKey: ["auth/logout"],
        mutationFn: logoutRequest(apiClient),
        onMutate: setPendingState,
        onSettled: handleLogout,
        gcTime: 0,
    });

    useEffect(() => {
        let timeoutId = null;
        if (tokenExpiresMillis !== null) {
            const timeout = tokenExpiresMillis - _.now();
            timeoutId = setTimeout(() => {
                doRefresh();
            }, timeout <= 0 ? INITIAL_REFRESH_DELAY_MILLIS : timeout);
        }

        if (timeoutId !== null) {
            return () => clearTimeout(timeoutId);
        }
    }, [tokenExpiresMillis, doRefresh]);

    const createInitialState = () => ({
        user: null,
        isPending: true, // because an attempt to refresh is always made on mount (see useEffect)
        isAuthenticated: false,
        login: (credentials: UserCredentials) => {
            doLogin(credentials);
        },
        logout: () => {
            doLogout();
        }
    } as AuthState);

    const [context, setContext] = useState(createInitialState);
    return (
        <AuthContext.Provider value={context}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
