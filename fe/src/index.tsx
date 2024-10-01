import React from "react";
import ReactDOM from "react-dom/client";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import App from "./App";
import ErrorPage from "./pages/ErrorPage";
import SampleView from "./pages/SampleView";
import {ViewContextPlayground} from "./features/DevTools";
import {Panorama} from "./features/Panorama";

// Inter font
import "@fontsource/inter/300.css";
import "@fontsource/inter/300-italic.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/400-italic.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/500-italic.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/600-italic.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/700-italic.css";

const router = createBrowserRouter(
    /* routes */
    [{
        path: "/",
        element: <App/>,
        errorElement: <ErrorPage/>,
        children: [
            {
                index: true,
                element: <SampleView/>,
            },
            {
                path: "/panorama",
                children: [{
                    index: true,
                    element: <Panorama/>,
                }, {
                    path: ":year",
                    element: <Panorama/>,
                }]
            },
            /* dev development only */
            {
                path: "/dev/view-context-playground",
                element: <ViewContextPlayground/>,
            },
        ]
    }],
    /* opts */
    {
        basename: process.env.REACT_APP_UI_ROOT,
    }
);

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>
);

reportWebVitals(/*console.log*/);
