import { AxiosInstance } from 'axios';
import {
  ServerInfoResponse,
  serverInfoResponseSchema,
} from '@patchwork2/schema';

export const serverInfoRequest =
  (client: AxiosInstance) => async (): Promise<ServerInfoResponse> =>
    client
      .get('server-info')
      .then((response) => serverInfoResponseSchema.parse(response.data));
