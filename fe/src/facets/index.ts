import {ApplicationFacet} from "@/types/facet";
import PanoramaFacet from "./Panorama";
import DevtoolsFacet from "./Devtools";
import ChecklistsFacet from "./Checklists";

const AppFacets: readonly ApplicationFacet[] = [
    ChecklistsFacet,
    PanoramaFacet,
    DevtoolsFacet, // TODO devtools should be excluded in production mode
];

export default AppFacets;
