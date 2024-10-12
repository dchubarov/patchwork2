import React from "react";
import ReactDOM from "react-dom/client";
import {RouterProvider} from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import {buildRouter} from "./lib/routing";
import App from "./App";
import ErrorPage from "./ErrorPage";
import SampleView from "./SampleView";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <RouterProvider router={buildRouter(<App/>, <ErrorPage/>, <SampleView/>)}/>
    </React.StrictMode>
);

reportWebVitals(/*console.log*/);

if (process.env.REACT_APP_API_MOCKING === "true") {
    /*await*/import("./backend-mock");
}
