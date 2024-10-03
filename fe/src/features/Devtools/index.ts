import {RouteObject} from "react-router-dom";
import {AppFeature} from "../../lib/appFeatureTypes";
import DevtoolsPage from "./pages/DevtoolsPage";

const DevtoolsFeature: AppFeature = {
    basename: "dev-tools",
    displayName: "Developer",
    routes: (): RouteObject[] => ([{
        index: true,
        Component: DevtoolsPage
    }/*,{
        path: "*",
        Component: DevtoolsPage
    }*/]),
}

export default DevtoolsFeature;
