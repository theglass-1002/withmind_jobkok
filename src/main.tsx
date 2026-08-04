import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import MaintenanceGuard from "./app/MaintenanceGuard";
import "./index.css";
import "./dev-test-maintenance";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <MaintenanceGuard>
      <RouterProvider router={router} />
    </MaintenanceGuard>
);
