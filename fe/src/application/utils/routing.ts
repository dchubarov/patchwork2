import {ReactNode} from "react";
import {createBrowserRouter} from "react-router-dom";
import AppFacets from "src/facets";

const baseUrl = process.env.REACT_APP_UI_ROOT;

export function buildRouter(
    rootElement: ReactNode,
    errorElement: ReactNode,
    initialPage?: ReactNode
) {
    return createBrowserRouter(
        [{
            element: rootElement,
            errorElement: errorElement,
            children: [
                {
                    index: true,
                    element: initialPage || null,
                },

                ...AppFacets.map((facet => ({
                    path: facet.basePath || facet.name,
                    children: facet.routes()
                }))),
            ]
        }],
        /* opts */
        {
            basename: baseUrl,
        });
}
