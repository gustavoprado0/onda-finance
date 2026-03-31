import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "./protected-route";
import AppLayout from "../layouts/AppLayout";
import Login from "../../pages/login";
import Dashboard from "../../pages/dashboard";
import Transfer from "../../pages/transfer";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "transfer", element: <Transfer /> },
    ],
  },
]);