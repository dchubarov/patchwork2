import {ReactNode} from "react";
import {createBrowserRouter} from "react-router-dom";
import AppFeatures from "../features";

export function buildRouter(
    rootElement: ReactNode,
    errorElement: ReactNode,
    initialPage?: ReactNode
) {
    return createBrowserRouter(
        [{
            path: "/",
            element: rootElement,
            errorElement: errorElement,
            children: [
                {
                    index: true,
                    element: initialPage || null,
                },

                ...AppFeatures.map((feature => ({
                    path: feature.basename,
                    children: feature.routes()
                }))),
            ]
        }],
        /* opts */
        {
            basename: process.env.REACT_APP_UI_ROOT,
        });
}
