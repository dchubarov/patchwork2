import _ from 'lodash';
import React, { PropsWithChildren, useEffect, useReducer } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ServerInfoResponse } from '@patchwork2/schema';
import {
  envGlobals,
  EnvironmentContext,
  EnvironmentApplicationFacet,
  EnvironmentState,
} from '@/types/env';
import { createApiClient } from '../lib/apiClient';
import monitoringApi from '../lib/monitoringApi';
import AppFacets from 'src/facets';
import { normalizeBasePath } from '@/utils/path';
import version from '../../version.json';

enum EnvironmentStateActionType {
  UPDATE_BACKEND_STATUS,
}

type EnvironmentStateAction = {
  type: EnvironmentStateActionType.UPDATE_BACKEND_STATUS;
  serverInfo: ServerInfoResponse | null;
};

const SERVER_MONITORING_INTERVAL_MILLIS = 30_000;
const apiClient = createApiClient();

const EnvironmentProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { status: serverInfoStatus, data: serverInfo } = useQuery({
    queryKey: ['/server-info'],
    queryFn: monitoringApi.serverInfoRequest(apiClient),
    refetchIntervalInBackground: true,
    refetchInterval: SERVER_MONITORING_INTERVAL_MILLIS,
    staleTime: SERVER_MONITORING_INTERVAL_MILLIS,
    throwOnError: false,
  });

  useEffect(() => {
    if (serverInfoStatus === 'success') {
      dispatch({
        type: EnvironmentStateActionType.UPDATE_BACKEND_STATUS,
        serverInfo,
      });
    } else if (serverInfoStatus === 'error') {
      dispatch({
        type: EnvironmentStateActionType.UPDATE_BACKEND_STATUS,
        serverInfo: null,
      });
    }
  }, [serverInfoStatus, serverInfo]);

  const createInitialState = () =>
    ({
      environment: envGlobals.ENV,
      globals: envGlobals,
      apiClient,
      backendStatus: 'unknown',
      versionInfo: 'Version ' + version.number,
      availableFacets: createFacetList(),
    }) as EnvironmentState;

  const [environment, dispatch] = useReducer(
    environmentStateReducer,
    null,
    createInitialState
  );
  return (
    <EnvironmentContext.Provider value={environment}>
      {children}
    </EnvironmentContext.Provider>
  );
};

export default EnvironmentProvider;

// Private

function environmentStateReducer(
  state: EnvironmentState,
  action: EnvironmentStateAction
): EnvironmentState {
  switch (action.type) {
    case EnvironmentStateActionType.UPDATE_BACKEND_STATUS:
      return {
        ...state,
        backendStatus: action.serverInfo !== null ? 'online' : 'offline',
        backendInfo: action.serverInfo?.server,
      };
  }
}

function createFacetList(): EnvironmentApplicationFacet[] {
  return AppFacets.map(
    (value) =>
      ({
        name: value.name,
        basePath: normalizeBasePath(value.basePath || value.name),
        authorization: value.authorization ?? false,
        category: value.category,
        icon: value.icon || undefined,
        defaultDisplayName: _.capitalize(
          value.defaultDisplayName || value.name
        ),
        localizedDisplayName: _.capitalize(
          value.defaultDisplayName || value.name
        ),
        localizedCategory: value.category
          ? _.capitalize(value.category)
          : undefined,
      }) as EnvironmentApplicationFacet
  );
}
