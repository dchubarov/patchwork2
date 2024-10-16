import {AppServer} from "../domain";
import {USER_ENTITY_KEY} from "../domain/userEntity";
import {Response} from "miragejs";

export default function userRoutes(server: AppServer) {
    server.get("/user/:id", async (schema, request) => {
        const user = schema.find("user", request.params.id);
        schema.findBy(USER_ENTITY_KEY, {email: "dime@twowls.org", status: "active"})
        return user
            || new Response(404, {}, {errors: [`User ${request.params.id} not found!`]});
    });
}
