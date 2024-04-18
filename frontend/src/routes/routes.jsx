import React from "react";
import Index from "../pages/index";
import SignUp from "../pages/Signup";
import SignIn from "../pages/Signin";
import SendResetPassword from "../pages/SendResetPassword";
import Dashboard from "../pages/Dashboard";
import Account from "../pages/Account";
import ProtectedRoute from "../utils/ProtectedRoutes";


const routes = [
    {
        path: "",
        element: <Index />,
    },
    {
        path: "signup",
        element: <SignUp />,
    },
    {
        path: "signin",
        element: <SignIn />,
    },
    {
        path: "send-reset-password",
        element: <SendResetPassword />,
    },
    {
        path: "dashboard",
        element: <ProtectedRoute element={<Dashboard />} />,
    },
    {
        path: "account",
        element: <ProtectedRoute element={<Account />} />,
    }
];

export default routes;