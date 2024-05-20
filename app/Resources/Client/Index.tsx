import React from "react";
import ReactDOM from "react-dom/client";
import App from "./Components/App";
import "boxicons/css/boxicons.min.css";
import "./i18n";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <App />,
    </React.StrictMode>,
);
