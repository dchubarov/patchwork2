import _ from "lodash";
import axios from "axios";

export function apiUrl(...paths: string[]) {
    const env = process.env.REACT_APP_API_ROOT;
    let path = "/" + (env === undefined ? "" : _.trim(env, "/"));
    paths.forEach((p) => {
        path += "/" + _.trim(p, "/");
    });
    return path;
}

export function apiExtensionUrl(...paths: string[]) {
    return apiUrl("x", ...paths);
}

export const createApiClient = () => axios.create();
