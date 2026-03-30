import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./protected-route";
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
    element: <Login />, // opcional (redirect depois)
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