import _ from "lodash";
import {Request} from "miragejs";
import {AnyResponse} from "miragejs/-types";
import Schema from "miragejs/orm/schema";
import {AppRegistry} from "../domain";
import {USER_ENTITY_KEY, UserDbModel} from "../domain/userEntity";
import {ForbiddenResponse, UnauthorizedResponse} from "../routes";
import {decodeJwt} from "@/utils/jwt";

export class UnauthorizedError extends Error {
    constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }
}

export class ForbiddenError extends Error {
    constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, ForbiddenError.prototype);
    }
}

type AuthorizedRouteHandler<R extends AnyResponse> = (
    schema: Schema<AppRegistry>,
    request: Request,
    user: UserDbModel) => R;

export function handleWithAuthorization<R extends AnyResponse = AnyResponse>(authorizedHandler: AuthorizedRouteHandler<R>) {
    return async (schema: Schema<AppRegistry>, request: Request) => {
        const user = getAuthenticatedUser(schema, request);
        if (user === null)
            return UnauthorizedResponse;

        try {
            return await authorizedHandler(schema, request, user);
        } catch (err) {
            console.log(err);
            if (err instanceof UnauthorizedError)
                return UnauthorizedResponse;
            else if (err instanceof ForbiddenError)
                return ForbiddenResponse;
            else
                throw err;
        }
    }
}

// Private

function getAuthenticatedUser(schema: Schema<AppRegistry>, request: Request): UserDbModel | null {
    let authenticatedUser: UserDbModel | null = null;
    const authorization = request.requestHeaders.Authorization;
    if (authorization && authorization.startsWith("Bearer:")) {
        const rawAccessToken = authorization.substring(7).trim();
        const accessToken = decodeJwt(rawAccessToken);
        if (accessToken.exp > Math.trunc(_.now() / 1000)) {
            if (accessToken.sub && accessToken.sub.startsWith("user:")) {
                const user = schema.find(USER_ENTITY_KEY, accessToken.sub.substring(5));
                if (!!user && user.status === "active") {
                    authenticatedUser = user;
                }
            }
        }
    }
    return authenticatedUser;
}
