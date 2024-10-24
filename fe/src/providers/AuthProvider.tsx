import _ from "lodash";
import React, {createContext, PropsWithChildren, useContext, useEffect, useRef, useState} from "react";
import {AxiosInstance, AxiosResponse} from "axios";
import {useMutation} from "@tanstack/react-query";
import {decodeJwt} from "../lib/jwt";
import {apiUrl} from "../lib/apiClient";
import {AuthState, LoginResponse, UserCredentials} from "../lib/auth";
import {useEnvironment} from "./EnvironmentProvider";

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
    const {apiClient} = useEnvironment();
    const accessTokenRef = useRef<string | null>(null);
    const requestInterceptorRef = useRef<number | null>(null);
    const [tokenExpiresMillis, setTokenExpiresMillis] = useState<number | null>(_.now() + 250); // TODO initial delay

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
            timeoutId = setTimeout(() => {
                doRefresh();
            }, tokenExpiresMillis - _.now());
        }
        return () => {
            if (timeoutId !== null) {
                clearTimeout(timeoutId);
            }
        }
    }, [tokenExpiresMillis, doRefresh]);

    const createInitialState = () => ({
        user: null,
        isPending: false,
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
