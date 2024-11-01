import {AppServer} from "../domain";
import userRoutes from "./userRoutes";
import infoRoutes from "./infoRoutes";
import authRoutes from "./authRoutes";
import checklistRoutes from "./checklistRoutes";
import {NotFoundResponse} from "../utils/response";

export default function configureRoutes(server: AppServer, baseUrl: string) {
    server.namespace = baseUrl + "/x";
    checklistRoutes(server);

    server.namespace = baseUrl;
    infoRoutes(server);
    authRoutes(server);
    userRoutes(server);
    fallbackRoutes(server);
}

function fallbackRoutes(server: AppServer) {
    server.head("*", async () => NotFoundResponse);
    server.options("*", async () => NotFoundResponse);
    server.get("*", async () => NotFoundResponse);
    server.post("*", async () => NotFoundResponse);
    server.put("*", async () => NotFoundResponse);
    server.patch("*", async () => NotFoundResponse);
    server.delete("*", async () => NotFoundResponse);
}
