import {RouteObject} from "react-router-dom";

export interface AppFeature {
    name: string;
    basePath?: string;
    defaultDisplayName?: string;
    category?: string;
    routes: () => RouteObject[];
}
