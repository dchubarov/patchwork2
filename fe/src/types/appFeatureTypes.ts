import {RouteObject} from "react-router-dom";

export interface AppFeature {
    basename: string;
    displayName?: string;
    category?: string;
    routes: () => RouteObject[];
}
