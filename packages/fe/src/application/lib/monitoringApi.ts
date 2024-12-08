import { AxiosInstance } from 'axios';
import {
  ServerInfoResponse,
  serverInfoResponseSchema,
} from '@patchwork2/schema';

const serverInfoRequest =
  (client: AxiosInstance) => async (): Promise<ServerInfoResponse> =>
    client
      .get('server-info')
      .then((response) => serverInfoResponseSchema.parse(response.data));

const monitoringApi = {
  serverInfoRequest,
};

export default monitoringApi;
