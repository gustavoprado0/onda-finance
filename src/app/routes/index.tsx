import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./protected-route";
import Dashboard from "../../pages/dashboard";
import Login from "../../pages/login";
import Transfer from "../../pages/transfer";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/transfer",
    element: (
      <ProtectedRoute>
        <Transfer />
      </ProtectedRoute>
    ),
  },
]);