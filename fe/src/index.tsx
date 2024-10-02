import React from "react";
import ReactDOM from "react-dom/client";
import {RouterProvider} from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import {buildRouter} from "./lib/routing";
import App from "./App";
import ErrorPage from "./ErrorPage";
import SampleView from "./SampleView";

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

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <RouterProvider router={buildRouter(<App/>, <ErrorPage/>, <SampleView/>)}/>
    </React.StrictMode>
);

reportWebVitals(/*console.log*/);
