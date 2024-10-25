import React from "react";
import ReactDOM from "react-dom/client";
import {RouterProvider} from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import {buildRouter} from "./lib/routing";
import {QueryClientProvider} from "@tanstack/react-query";
import {App, DefaultPage, ErrorPage}  from "./application";
import {EnvironmentProvider, AuthProvider} from "./providers";
import createQueryClient from "./lib/queryClient";

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
    /*await*/
    import("./backend-mock");
}

reportWebVitals(/*console.log*/);
