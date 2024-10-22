import {AppServer} from "../domain";
import {Response} from "miragejs";

export default function userRoutes(server: AppServer) {
    server.get("/user/:id", async (schema, request) => {
        const user = schema.find("user", request.params.id);
        return user || new Response(404, {}, {errors: [`User ${request.params.id} not found!`]});
    });
}
