import React from "react";
import ReactDOM from "react-dom/client";
import {RouterProvider} from "react-router-dom";
import defaultRouter from "./Routing";
import reportWebVitals from "./reportWebVitals";

import "@fontsource/inter";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <RouterProvider router={defaultRouter}/>
    </React.StrictMode>
);

reportWebVitals(/*console.log*/);
