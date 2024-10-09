import {AppServer} from "../domain";
import {Response} from "miragejs";
import userRoutes from "./userRoutes";
import infoRoutes from "./infoRoutes";
import authRoutes from "./authRoutes";
import checklistRoutes from "./checklistRoutes";

export const BadRequestResponse = new Response(400);
export const NotFoundResponse = new Response(404);
export const UnauthorizedResponse = new Response(401);

export default function configureRoutes(server: AppServer) {
    infoRoutes(server);
    authRoutes(server);
    userRoutes(server);
    checklistRoutes(server);
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
