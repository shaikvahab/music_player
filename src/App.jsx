import React from "react";
import "./App.css";
import { createHashRouter, RouterProvider, Outlet } from "react-router-dom";
import Homepage from "./Components/Homepage";

const Layout = () => (
  <>
    {/* Layout should render children using Outlet */}
    <Outlet />
  </>
);

// Hash Router Configuration
const router = createHashRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Homepage /> },
    ],
  },
]);

const App = () => <RouterProvider router={router} />;

export default App;

