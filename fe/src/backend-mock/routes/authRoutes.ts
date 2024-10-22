import {Response} from "miragejs";
import {AppServer} from "../domain";
import {USER_ENTITY_KEY} from "../domain/userEntity";
import {UnauthorizedResponse} from "./index";

export default function authRoutes(server: AppServer) {
    server.post("/auth/login", async (schema, request) => {
        const json = JSON.parse(request.requestBody);
        if (typeof json.login === "string" && json.login !== "") {
            const user = schema.findBy(USER_ENTITY_KEY,
                (record) => record.username === json.login || record.email === json.login)

            /*
            if (request.queryParams.noCookie === undefined) {
                const cookieExpiration = new Date(new Date().getTime() + 24 * 3600 * 1000);
                document.cookie = `auth-token=123456; path=/; expires=${cookieExpiration.toUTCString()}`;
            }
            */

            if (user) {
                return new Response(200, undefined, {
                    user: {
                        ...user.attrs
                    },
                    refreshToken: "12344565093201239023",
                    apiToken: "1234567890"
                });
            }
        }

        return UnauthorizedResponse;
    });
}
