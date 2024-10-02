import {RouteObject} from "react-router-dom";
import ViewContextPlayground from "./pages/ViewContextPlayground";
import {AppFeature} from "../../lib/appFeatureTypes";

const DevtoolsFeature: AppFeature = {
    basename: "dev-tools",
    displayName: "Dev Tools",
    routes: (): RouteObject[] => ([{
        path: "view-context-playground",
        Component: ViewContextPlayground
    }]),
}

export default DevtoolsFeature;
