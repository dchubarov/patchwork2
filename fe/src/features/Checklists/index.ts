import {AppFeature} from "../../lib/appFeatureTypes";
import React from "react";

const LazyChecklistsPage = React.lazy(() => import("./pages/ChecklistsPage"));

const ChecklistsFeature : AppFeature = {
    basename: "checklists",
    displayName: "Checklists",
    routes: () => ([{
        index: true,
        Component: LazyChecklistsPage
    },{
        path: ":checklist",
        Component: LazyChecklistsPage
    }]),
}

export default ChecklistsFeature;
