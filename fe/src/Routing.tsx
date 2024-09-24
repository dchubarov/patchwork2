import {createBrowserRouter} from "react-router-dom";
import App from "./App";
import ErrorPage from "./ErrorPage";
import SampleView from "./SampleView";
import React from "react";
import ViewContextPlayground from "./ViewContextPlayground";

const router = createBrowserRouter(
    /* routes */
    [{
        path: "/",
        element: <App/>,
        errorElement: <ErrorPage/>,
        children: [
            {
                index: true,
                element: <SampleView/>
            },
            {
                path: "/dev/view-context-playground",
                element: <ViewContextPlayground/>
            },
        ]
    }],
    /* opts */
    {
        basename: process.env.REACT_APP_UI_ROOT
    }
);

export default router;
