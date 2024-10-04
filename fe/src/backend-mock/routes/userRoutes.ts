import {AppServer} from "../domain";
import {NotFoundResponse} from "./index";
import {USER_ENTITY_KEY} from "../domain/userEntity";

export default function userRoutes(server: AppServer) {
    server.get("/user/:id", async (schema, request) => {
        const user = schema.find("user", request.params.id);
        schema.findBy(USER_ENTITY_KEY, {email: "dime@twowls.org", status: "active"})
        return user || NotFoundResponse;
    });
}
