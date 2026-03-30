import { createBrowserRouter } from "react-router-dom";
import Login from "../../pages/login";
import Dashboard from "../../pages/dashboard";
import Transfer from "../../pages/transfer";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/transfer",
    element: <Transfer />,
  },
]);