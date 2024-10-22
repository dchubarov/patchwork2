import {Response} from "miragejs";
import {AppServer} from "../domain";
import {USER_ENTITY_KEY} from "../domain/userEntity";
import {UnauthorizedResponse} from "./index";
import {createJWT} from "../utils/createJwt";

export default function authRoutes(server: AppServer) {
    server.post("/auth/login", async (schema, request) => {
        const json = JSON.parse(request.requestBody);
        if (typeof json.login === "string" && json.login !== "") {
            const user = schema.findBy(USER_ENTITY_KEY,
                (record) => record.username === json.login || record.email === json.login)

            const now = Math.trunc(new Date().getTime() / 1000);

            const tokenContents = {
                /* iss: issuer, sub: subject, aud: audience, exp: expiration, nbf: not-before-time, iat: issued-at-time, jti: JWT ID */
                iat: now,
                exp: now + 3600,
                sub: `uid@${user?.id || 0}`
            };

            const token = await createJWT(tokenContents, "your-256-bit-secret");

            /*
            if (request.queryParams.noCookie === undefined) {
                const cookieExpiration = new Date(new Date().getTime() + 24 * 3600 * 1000);
                document.cookie = `refresh-token=123456; path=/; expires=${cookieExpiration.toUTCString()}; SameSite=Strict; HttpOnly`;
            }
            */

            if (user) {
                return new Response(200, undefined, {
                    user: {
                        ...user.attrs
                    },
                    apiToken: token
                });
            }
        }

        return UnauthorizedResponse;
    });

    server.get("/auth/refresh", async () => {
        // TODO: refresh-token should be in a cookie
    });

    server.get("/auth/logout", async () => {
    });
}
