import React from "react";
import ReactDOM from "react-dom/client";
import {RouterProvider} from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import {buildRouter} from "./application/utils/routing";
import {QueryClientProvider} from "@tanstack/react-query";
import {App, DefaultPage, ErrorPage}  from "./application";
import EnvironmentProvider from "./application/providers/EnvironmentProvider";
import AuthProvider from "./application/providers/AuthProvider";
import createQueryClient from "./application/utils/queryClient";
import {logger} from "@/utils/logging";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <QueryClientProvider client={createQueryClient()}>
            <EnvironmentProvider>
                <AuthProvider>
                    <RouterProvider router={buildRouter(<App/>, <ErrorPage/>, <DefaultPage/>)}/>
                </AuthProvider>
            </EnvironmentProvider>
        </QueryClientProvider>
    </React.StrictMode>
);

if (process.env.REACT_APP_API_MOCKING === "true") {
    require("./mocker");
    logger.log("Installed backend mocker (MirageJS).")
}

reportWebVitals(/*console.log*/);
