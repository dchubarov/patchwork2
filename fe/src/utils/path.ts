import _ from "lodash";

/**
 * Ensures that given path has a single leading slash, and no trailing slash(es).
 * If normalized path represents root ('/'), an empty string is returned.
 */
export const normalizeBasePath = (path: string | undefined) => {
    const strippedPath = _.trim(path !== undefined ? path.trim() : "", "/");
    return strippedPath === "" ? strippedPath : "/" + strippedPath;
}
