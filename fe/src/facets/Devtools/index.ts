import {RouteObject} from "react-router-dom";
import {ApplicationFacet} from "@/types/facet";
import DevtoolsPage from "./pages/DevtoolsPage";

const DevtoolsFacet: ApplicationFacet = {
    name: "devtools",
    basePath: "dev-tools",
    defaultDisplayName: "Developer",
    icon: "DEV",
    routes: (): RouteObject[] => ([{
        index: true,
        Component: DevtoolsPage
    }/*,{
        path: "*",
        Component: DevtoolsPage
    }*/]),
}

export default DevtoolsFacet;
