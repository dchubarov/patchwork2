import React from "react";
import ReactDOM from "react-dom/client";
import {RouterProvider} from "react-router-dom";
import defaultRouter from "./Routing";
import reportWebVitals from "./reportWebVitals";

// Inter font
import "@fontsource/inter/400.css";
import "@fontsource/inter/400-italic.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/600-italic.css";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <RouterProvider router={defaultRouter}/>
    </React.StrictMode>
);

reportWebVitals(/*console.log*/);
