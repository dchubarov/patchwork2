import {AppFeature} from "@/types/appFeatureTypes";
import React from "react";

const LazyChecklistsPage = React.lazy(() => import("./pages/ChecklistsPage"));

const ChecklistsFeature : AppFeature = {
    name: "checklists",
    routes: () => ([{
        index: true,
        Component: LazyChecklistsPage
    },{
        path: ":checklist",
        Component: LazyChecklistsPage
    }]),
}

export default ChecklistsFeature;
