import React from "react";
import { createHashRouter, RouterProvider } from "react-router-dom";
import Homepage from "./Components/Homepage";
import "./App.css";

const router = createHashRouter([
  { path: "/", element: <Homepage/> }
]);

const App = () => <RouterProvider router={router} />;

export default App;
