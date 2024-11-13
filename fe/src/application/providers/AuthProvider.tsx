import _ from 'lodash';
import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { AxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';
import {
  AuthContext,
  AuthState,
  LoginResponse,
  UserCredentials,
} from '@/types/auth';
import authApi from '../api/auth';
import { useApiClient } from '@/hooks/env';
import { decodeJwt } from '@/utils/jwt';
import { showNotification } from '@/utils/notification';
import { logger } from '@/utils/logging';

const MAX_REFRESH_RETRY_COUNT = 3;

const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const apiClient = useApiClient();
  const accessTokenRef = useRef<string | null>(null);
  const requestInterceptorRef = useRef<number | null>(null);
  const [tokenExpiresMillis, setTokenExpiresMillis] = useState<number | null>(
    0
  ); // causes immediate refresh attempt

  const handleSuccessfulLogin = (data: LoginResponse) => {
    if (data.accessToken) {
      accessTokenRef.current = data.accessToken;
      const jwt = decodeJwt(data.accessToken);
      setTokenExpiresMillis(jwt.exp * 1000);
    }

    setContext((prev) => ({
      ...prev,
      user:
        prev.user && _.isEqual(prev.user, data.user) ? prev.user : data.user,
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
        }
      );
    }
  };

  const handleLogout = (error?: Error) => {
    if (error && accessTokenRef.current !== null) {
      logger.error(`Logged out due to error: ${error.message}`);
    }

    accessTokenRef.current = null;
    setTokenExpiresMillis(null);
    setContext((prev) => ({
      ...prev,
      user: null,
      isAuthenticated: false,
      isPending: false,
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
    let timeoutId = null;
    if (tokenExpiresMillis !== null) {
      // TODO better refresh before expiration considering request latency, clock skew, etc
      const timeout = tokenExpiresMillis - _.now();
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
      login: (credentials: UserCredentials) => {
        doLogin(credentials);
      },
      logout: () => {
        doLogout();
      },
    }) as AuthState;

  const [context, setContext] = useState(createInitialState);
  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
