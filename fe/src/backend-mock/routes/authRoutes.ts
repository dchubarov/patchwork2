import {Response} from "miragejs";
import {AppServer} from "../domain";
import {USER_ENTITY_KEY} from "../domain/userEntity";
import {UnauthorizedResponse} from "./index";
import {createJwt, decodeJwt, JwtPayload} from "../../lib/jwt";
import * as cookie from "cookie";
import _ from "lodash";

// This is a mock server so secret is not secret at all.
const SERVER_JWT_SECRET = "A02B5BD6-188E-4C73-B595-D6CE3725072B";

const REFRESH_TOKEN_COOKIE_NAME = "REFRESH_TOKEN";
const REFRESH_TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60;
const ACCESS_TOKEN_TTL_SECONDS = 5 * 60;

export default function authRoutes(server: AppServer) {
    server.post("/auth/login", async (schema, request) => {
        const json = JSON.parse(request.requestBody);
        if (typeof json.login === "string" && json.login !== "") {
            const user = schema.findBy(USER_ENTITY_KEY,
                (record) => record.username === json.login || record.email === json.login)

            if (user === null || !user.id) {
                return UnauthorizedResponse;
            }

            const epochSeconds = Math.trunc(_.now() / 1000);
            const accessToken = await createToken(user.id, ACCESS_TOKEN_TTL_SECONDS, epochSeconds);

            if (request.queryParams.noCookie === undefined) {
                const refreshToken = await createToken(user.id, REFRESH_TOKEN_TTL_SECONDS, epochSeconds);
                const cookieExpirationDate = new Date((epochSeconds + REFRESH_TOKEN_TTL_SECONDS) * 1000);

                // The cookie should be Secure and HttpOnly but that's not possible by using document cookie,
                // and Set-Cookie header is prohibited.
                // See https://miragejs.com/docs/advanced/simulating-cookie-responses/
                document.cookie = cookie.serialize(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
                    expires: cookieExpirationDate,
                    maxAge: REFRESH_TOKEN_TTL_SECONDS,
                    path: "/"
                });
            }

            return new Response(200, undefined, {
                user: user.attrs,
                accessToken
            });
        }

        return UnauthorizedResponse;
    });

    server.get("/auth/refresh", async (schema) => {
        // Since this is a mock backend working in browser, we just parse existing cookies.
        // In production cookie should be sent with request.
        const cookies = cookie.parse(document.cookie);
        if (!cookies[REFRESH_TOKEN_COOKIE_NAME]) {
            return UnauthorizedResponse;
        }

        const jwt = decodeJwt(cookies[REFRESH_TOKEN_COOKIE_NAME]);
        if (!jwt.exp && jwt.exp * 1000 <= _.now()) {
            return UnauthorizedResponse;
        }

        if (!jwt.sub || !_.startsWith(jwt.sub, "user:")) {
            return UnauthorizedResponse;
        }

        const user = schema.find(USER_ENTITY_KEY, jwt.sub.substring(5));
        if (user === null || !user.id) {
            return UnauthorizedResponse;
        }

        const accessToken = await createToken(user.id, ACCESS_TOKEN_TTL_SECONDS);
        return new Response(200, undefined, {
            user: user.attrs,
            accessToken
        });
    });

    server.get("/auth/logout", async () => {
        // Just delete REFRESH_TOKEN cookie
        document.cookie = cookie.serialize(REFRESH_TOKEN_COOKIE_NAME, "", {
            expires: new Date(0),
            path: "/"
        });
    });
}

async function createToken(userId: string, ttlSeconds: number, epochSeconds?: number) {
    const ts = epochSeconds || Math.trunc(_.now() / 1000);
    const tokenContents: JwtPayload = {
        iat: ts,
        exp: ts + ttlSeconds,
        sub: `user:${userId}`,
    };

    return await createJwt(tokenContents, SERVER_JWT_SECRET);
}
