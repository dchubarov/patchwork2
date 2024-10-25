import {RouteObject} from "react-router-dom";
import {AppFeature} from "@/types/appFeatureTypes";
import DevtoolsPage from "./pages/DevtoolsPage";

const DevtoolsFeature: AppFeature = {
    name: "devtools",
    basePath: "dev-tools",
    defaultDisplayName: "Developer",
    routes: (): RouteObject[] => ([{
        index: true,
        Component: DevtoolsPage
    }/*,{
        path: "*",
        Component: DevtoolsPage
    }*/]),
}

export default DevtoolsFeature;
