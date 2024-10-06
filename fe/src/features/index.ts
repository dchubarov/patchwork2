import {AppFeature} from "../lib/appFeatureTypes";
import PanoramaFeature from "./Panorama";
import DevtoolsFeature from "./Devtools";
import TodoFeature from "./Todo";

const AppFeatures: readonly AppFeature[] = [
    TodoFeature,
    PanoramaFeature,
    DevtoolsFeature, // TODO devtools should be excluded in production mode
];

export default AppFeatures;
