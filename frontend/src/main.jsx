import React from 'react'
import ReactDOM from 'react-dom/client'
import ThemeCustomization from './theme';
import routes from './routes/routes';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './routes/Root';


const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        errorElement: <div>Not Found 404 !!!</div>,
        children: routes,
        
    }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <ThemeCustomization>
            <RouterProvider router={router} />
        </ThemeCustomization>
    </React.StrictMode>
);