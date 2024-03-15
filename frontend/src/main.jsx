import React from 'react'
import ReactDOM from 'react-dom/client'
import ThemeCustomization from './theme';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ProtectedRoute from './utils/ProtectedRoutes';
import Root from './routes/Root';
import Index from './pages/index';
import SignUp from './pages/Signup';
import SignIn from './pages/Signin';
import Dashboard from './pages/Dashboard';
import Account from './pages/Account';


const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        errorElement: <div>Not Found 404 !!!</div>,
        children: [
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
                path: "dashboard",
                element: <ProtectedRoute element={<Dashboard />} />,
            },
            {
                path: "account",
                element: <ProtectedRoute element={<Account />} />,
            }
        ],
        
    }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <ThemeCustomization>
            <RouterProvider router={router} />
        </ThemeCustomization>
    </React.StrictMode>
);