import z from "zod";
import {AxiosInstance} from "axios";

const serverInfoResponseSchema = z.object({
    server: z.string(),
    status: z.string(),
    timestamp: z.number(),
});

export type ServerInfoResponse = z.infer<typeof serverInfoResponseSchema>;

const serverInfoRequest = (client: AxiosInstance) =>
    async (): Promise<ServerInfoResponse> => client
        .get("server-info")
        .then(response => serverInfoResponseSchema.parse(response.data));

const monitoringApi = {
    serverInfoRequest,
}

export default monitoringApi;
