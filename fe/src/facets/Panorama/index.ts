import {RouteObject} from "react-router-dom";
import {ApplicationFacet} from "@/types/facet";

const PanoramaDynamic = async () => {
    const {default: Component} = await import("./components/Panorama");
    return Component;
}

const PanoramaFacet: ApplicationFacet = {
    name: "panorama",
    routes: (): RouteObject[] => ([{
        index: true,
        lazy: async () => ({Component: await PanoramaDynamic()}),
    }, {
        path: ":year",
        lazy: async () => ({Component: await PanoramaDynamic()}),
    }]),
}

export default PanoramaFacet;
