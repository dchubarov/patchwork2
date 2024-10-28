import {ApplicationFacet} from "@/types/facet";
import React from "react";

const LazyChecklistsPage = React.lazy(() => import("./pages/ChecklistsPage"));

const ChecklistsFacet: ApplicationFacet = {
    name: "checklists",
    routes: () => ([{
        index: true,
        Component: LazyChecklistsPage,
    }]),
}

export default ChecklistsFacet;
