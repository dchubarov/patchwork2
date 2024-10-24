import React from "react";
import ReactDOM from "react-dom/client";
import {RouterProvider} from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import {buildRouter} from "./lib/routing";
import {QueryClientProvider} from "@tanstack/react-query";
import queryClient from "./lib/queryClient";
import App from "./App";
import ErrorPage from "./ErrorPage";
import SampleView from "./SampleView";
import EnvironmentProvider from "./providers/EnvironmentProvider";
import AuthProvider from "./providers/AuthProvider";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <EnvironmentProvider>
                <AuthProvider>
                    <RouterProvider router={buildRouter(<App/>, <ErrorPage/>, <SampleView/>)}/>
                </AuthProvider>
            </EnvironmentProvider>
        </QueryClientProvider>
    </React.StrictMode>
);

if (process.env.REACT_APP_API_MOCKING === "true") {
    /*await*/
    import("./backend-mock");
}

reportWebVitals(/*console.log*/);
