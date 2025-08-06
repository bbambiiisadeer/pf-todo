import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import './style.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./routes/LoginPage.tsx";
import RegisterPage from "./routes/RegisterPage.tsx";
import AppLayout from "./Applayout.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />, // use AuthProvider in here
    children: [
      {
        path: "/",
        element: <ProtectedRoute><App /></ProtectedRoute>,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode> 

  <RouterProvider router={router} />
  </React.StrictMode>
);