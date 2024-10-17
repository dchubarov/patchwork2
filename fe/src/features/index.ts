import {AppFeature} from "../lib/appFeatureTypes";
import PanoramaFeature from "./Panorama";
import DevtoolsFeature from "./Devtools";
import ChecklistsFeature from "./Checklists";

const AppFeatures: readonly AppFeature[] = [
    ChecklistsFeature,
    PanoramaFeature,
    DevtoolsFeature, // TODO devtools should be excluded in production mode
];

export default AppFeatures;
