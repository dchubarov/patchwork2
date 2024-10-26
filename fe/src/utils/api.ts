import _ from "lodash";
import {envGlobals} from "@/types/env";

export function apiUrl(...paths: string[]) {
    let path = "/" + envGlobals.API_ROOT;
    paths.forEach((p) => {
        path += "/" + _.trim(p, "/");
    });
    return path;
}

export function apiExtensionUrl(...paths: string[]) {
    return apiUrl("x", ...paths);
}
