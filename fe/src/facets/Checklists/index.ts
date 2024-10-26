import React from "react";
import {ApplicationFacet} from "@/types/facet";
import SvgChecklists from "./assets/checklist.svg";

const LazyChecklistsPage = React.lazy(() => import("./pages/ChecklistsPage"));

const ChecklistsFacet : ApplicationFacet = {
    name: "checklists",
    icon: SvgChecklists,
    routes: () => ([{
        index: true,
        Component: LazyChecklistsPage
    },{
        path: ":checklist",
        Component: LazyChecklistsPage
    }]),
}

export default ChecklistsFacet;
