import {createBrowserRouter} from "react-router-dom";
import App from "./App";
import ErrorPage from "./ErrorPage";
import SampleView from "./SampleView";
import React from "react";

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
            }
        ]
    }],
    /* opts */
    {
        basename: process.env.REACT_APP_UI_ROOT
    }
);

export default router;
