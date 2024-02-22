import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ProtectedRoute from './utils/ProtectedRoutes';
import Root from './routes/Root';
import Index from './routes/Index';
import SignUp from './pages/Signup';
import SignIn from './pages/Signin';
import Dashboard from './pages/Dashboard';


// Create a user context
export const UserContext = createContext(null);

// === Main Component === //
function Main() {
    const [currentUser, setCurrentUser] = useState(null);

    // === Axios Configuration === //
    axios.defaults.xsrfCookieName = 'csrftoken';
    axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
    axios.defaults.withCredentials = true;

    // === Axios Client === //
    const client = axios.create({
        baseURL: 'http://localhost:8000/'
    });

    useEffect(() => {
        client.get("/api/user")
            .then(function (res) {
                setCurrentUser(true);
            })
            .catch(function (error) {
                setCurrentUser(false);
            });
    }, []);

    const router = createBrowserRouter([
        {
            path: '/',
            element: <Root />,
            errorElement: <div>Not Found 404 !!!</div>,
            children: [
                { index: true, element: <Index /> },
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
                }
            ],
          
        }
    ]);

    return (
        <React.StrictMode>
            <UserContext.Provider value={{ currentUser, setCurrentUser, client }}>
                <RouterProvider router={router} />
            </UserContext.Provider>
        </React.StrictMode>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Main />);