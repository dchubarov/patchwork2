import {RouteObject} from "react-router-dom";
import ViewContextPlayground from "./components/ViewContextPlayground";
import {AppFeature} from "../../lib/appFeatureTypes";
import DevtoolsPage from "./pages/DevtoolsPage";

const DevtoolsFeature: AppFeature = {
    basename: "dev-tools",
    displayName: "Developer",
    routes: (): RouteObject[] => ([{
        index: true,
        Component: DevtoolsPage
    },{
        path: "view-context-playground",
        Component: ViewContextPlayground
    },{
        path: "*",
        Component: DevtoolsPage
    }]),
}

export default DevtoolsFeature;
