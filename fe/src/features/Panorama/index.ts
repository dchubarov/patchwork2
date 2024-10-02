import {RouteObject} from "react-router-dom";
import {AppFeature} from "../../lib/appFeatureTypes";

const PanoramaDynamic = async () => {
    const {default: Component} = await import("./components/Panorama");
    return Component;
}

const PanoramaFeature: AppFeature = {
    basename: "panorama",
    displayName: "Panorama",
    routes: (): RouteObject[] => ([{
        index: true,
        lazy: async () => ({Component: await PanoramaDynamic()}),
    }, {
        path: ":year",
        lazy: async () => ({Component: await PanoramaDynamic()}),
    }]),
}

export default PanoramaFeature;
