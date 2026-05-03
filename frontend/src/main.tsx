import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App apiBaseUrl={import.meta.env.VITE_API_BASE_URL ?? ""} />
  </React.StrictMode>,
);
