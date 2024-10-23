import {Response} from "miragejs";
import {AppServer} from "../domain";
import {USER_ENTITY_KEY} from "../domain/userEntity";
import {UnauthorizedResponse} from "./index";
import {createJWT, JwtPayload} from "../utils/createJwt";
import * as cookie from "cookie";

// This is a mock server so secret is not secret at all.
const SERVER_JWT_SECRET = "eeT8ohghu8eu3oave4Yahph5boo8nai7oup6Uo3eijeuzohr";
const REFRESH_TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60;
const ACCESS_TOKEN_TTL_SECONDS = 60 * 60;

export default function authRoutes(server: AppServer) {
    server.post("/auth/login", async (schema, request) => {
        const json = JSON.parse(request.requestBody);
        if (typeof json.login === "string" && json.login !== "") {
            const user = schema.findBy(USER_ENTITY_KEY,
                (record) => record.username === json.login || record.email === json.login)

            const epochSeconds = Math.trunc(new Date().getTime() / 1000);
            const tokenContents: Partial<JwtPayload> = {
                iat: epochSeconds,
                sub: `uid@${user?.id || 0}`,
            };

            const accessToken = await createJWT({
                ...tokenContents,
                exp: epochSeconds + ACCESS_TOKEN_TTL_SECONDS
            }, SERVER_JWT_SECRET);

            if (request.queryParams.noCookie === undefined) {
                const refreshToken = await createJWT({
                    ...tokenContents,
                    exp: epochSeconds + REFRESH_TOKEN_TTL_SECONDS
                }, SERVER_JWT_SECRET);

                const cookieExpirationDate = new Date((epochSeconds + REFRESH_TOKEN_TTL_SECONDS) * 1000);

                // The cookie should be Secure and HttpOnly but that's not possible by using document cookie,
                // and Set-Cookie header is prohibited.
                // See https://miragejs.com/docs/advanced/simulating-cookie-responses/
                document.cookie = cookie.serialize("REFRESH_TOKEN", refreshToken, {
                    expires: cookieExpirationDate,
                    maxAge: REFRESH_TOKEN_TTL_SECONDS,
                    path: "/"
                });
            }

            if (user) {
                return new Response(200, undefined, {
                    user: user.attrs,
                    accessToken
                });
            }
        }

        return UnauthorizedResponse;
    });

    server.get("/auth/refresh", async () => {
        // TODO: refresh-token should be in a cookie
        //cookie.parse(document.cookie)[REFRESH_TOKEN]
    });

    server.get("/auth/logout", async () => {
    });
}
