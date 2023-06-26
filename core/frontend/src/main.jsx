import * as React from "react";
import * as ReactDOM from "react-dom/client";

import { BrowserRouter } from "react-router-dom";

import App from "./page/sidebar";

ReactDOM.createRoot(document.querySelector("#root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);
