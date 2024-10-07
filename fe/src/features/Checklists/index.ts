import {AppFeature} from "../../lib/appFeatureTypes";
import React from "react";

const ChecklistsFeature : AppFeature = {
    basename: "checklists",
    displayName: "Checklists",
    routes: () => ([{
        index: true,
        Component: React.lazy(() => import("./pages/ChecklistsPage")),
    }]),
}

export default ChecklistsFeature;
