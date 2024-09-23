import {createBrowserRouter} from "react-router-dom";
import App from "./App";
import ErrorPage from "./ErrorPage";
import SampleView from "./SampleView";
import React from "react";
import SampleView2 from "./SampleView2";

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
                path: "/users/profile",
                element: <SampleView2/>
            }
        ]
    }],
    /* opts */
    {
        basename: process.env.REACT_APP_UI_ROOT
    }
);

export default router;
