import {AppFeature} from "../lib/appFeatureTypes";
import PanoramaFeature from "./Panorama";
import DevtoolsFeature from "./Devtools";

const AppFeatures: readonly AppFeature[] = [
    PanoramaFeature,
    DevtoolsFeature, // TODO devtools should be excluded in production mode
];

export default AppFeatures;
