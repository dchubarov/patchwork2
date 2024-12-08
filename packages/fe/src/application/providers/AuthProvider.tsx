import _ from 'lodash';
import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { AxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';
import { AuthContext, AuthState } from '@/types/auth';
import { LoginResponse, LoginRequest } from '@patchwork2/schema';
import { useApiClient } from '@/hooks/env';
import { decodeJwt, JwtPayload } from '@/utils/jwt';
import { showNotification } from '@/utils/notification';
import { logger } from '@/utils/logging';
import authApi from '../lib/authApi';

const MAX_REFRESH_RETRY_COUNT = 3;
const REFRESH_BEFORE_EXPIRATION_MILLIS = 3000;

const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const apiClient = useApiClient();
  const accessTokenRef = useRef<string | null>(null);
  const requestInterceptorRef = useRef<number | null>(null);
  const [isInitialRefresh, setInitialRefresh] = useState(true);
  const [tokenExpiresMillis, setTokenExpiresMillis] = useState<number | null>(
    0 // causes immediate refresh attempt
  );

  const handleSuccessfulLogin = (data: LoginResponse) => {
    let jwt: JwtPayload | null = null;
    if (data.accessToken) {
      accessTokenRef.current = data.accessToken;
      jwt = decodeJwt(data.accessToken);
      setTokenExpiresMillis(jwt.exp * 1000);
    }

    // TODO error if no token, token expired, etc
    setInitialRefresh(false);
    setContext((prev) => ({
      ...prev,
      isPending: false,
      isAuthenticated: true,
      sessionClaims: jwt!!,
      user:
        prev.user && _.isEqual(prev.user, data.user) ? prev.user : data.user,
    }));

    if (requestInterceptorRef.current === null) {
      requestInterceptorRef.current = apiClient.interceptors.request.use(
        (config) => {
          config.headers.Authorization = `Bearer ${accessTokenRef.current}`;
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    }
  };

  const handleLogout = (error?: Error) => {
    if (error && accessTokenRef.current !== null) {
      logger.error(`Logged out due to error: ${error.message}`);
    }

    accessTokenRef.current = null;

    setInitialRefresh(false);
    setTokenExpiresMillis(null);
    setContext((prev) => ({
      ...prev,
      isPending: false,
      isAuthenticated: false,
      sessionClaims: null,
      user: null,
    }));

    if (requestInterceptorRef.current !== null) {
      apiClient.interceptors.request.eject(requestInterceptorRef.current);
      requestInterceptorRef.current = null;
    }
  };

  const shouldRetryRefreshAttempt = (
    failureCount: number,
    error: Error
  ): boolean => {
    if (error instanceof AxiosError) {
      // Error 404 excluded for now since if mock backend isn't ready yet, it will return 404, so we need to retry.
      if ([-1, 400, 401 /*, 404*/].includes(error.status || -1)) {
        return false;
      }
    } else {
      return false;
    }
    return failureCount < MAX_REFRESH_RETRY_COUNT;
  };

  const setPendingState = () => {
    setContext((prev) => ({
      ...prev,
      isPending: true,
    }));
  };

  const { mutate: doRefresh } = useMutation({
    mutationKey: ['auth/refresh'],
    mutationFn: authApi.refreshRequest(apiClient),
    onMutate: setPendingState,
    onSuccess: handleSuccessfulLogin,
    onError: handleLogout,
    retry: shouldRetryRefreshAttempt,
    gcTime: 0,
  });

  const { mutate: doLogin } = useMutation({
    mutationKey: ['auth/login'],
    mutationFn: authApi.loginRequest(apiClient),
    onMutate: setPendingState,
    onSuccess: (data) => {
      handleSuccessfulLogin(data);
      showNotification('You have successfully logged in', { type: 'success' });
    },
    onError: (error) => {
      handleLogout(error);
      showNotification('Authentication failed', {
        subtitle: error.message,
        type: 'error',
      });
    },
    gcTime: 0,
  });

  const { mutate: doLogout } = useMutation({
    mutationKey: ['auth/logout'],
    mutationFn: authApi.logoutRequest(apiClient),
    onMutate: setPendingState,
    onSettled: () => handleLogout(),
    gcTime: 0,
  });

  useEffect(() => {
    let timeoutId: any = null;
    if (tokenExpiresMillis !== null) {
      const timeout =
        tokenExpiresMillis - REFRESH_BEFORE_EXPIRATION_MILLIS - _.now();
      if (timeout <= 0) {
        doRefresh();
      } else {
        timeoutId = setTimeout(() => {
          doRefresh();
        }, timeout);
      }
    }

    if (timeoutId !== null) {
      return () => clearTimeout(timeoutId);
    }
  }, [tokenExpiresMillis, doRefresh]);

  const createInitialState = () =>
    ({
      user: null,
      isPending: true, // because an attempt to refresh is always made on mount (see useEffect)
      isAuthenticated: false,
      sessionClaims: null,
      login: (credentials: LoginRequest) => {
        doLogin(credentials);
      },
      logout: () => {
        doLogout();
      },
    }) as AuthState;

  const [context, setContext] = useState(createInitialState);
  return (
    <AuthContext.Provider value={context}>
      {/*TODO some kind of waiting message needed here if authentication takes long*/}
      {!(isInitialRefresh && context.isPending) && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
