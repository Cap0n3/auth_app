import { createContext, useState, useEffect } from 'react';
import Nav from '../components/Common/Navbar';
import { Outlet } from 'react-router-dom';
import axios from 'axios';
import { checkAuth } from '../services/userservice';

// Create a user context for the entire app
export const UserContext = createContext(null);

export default function Root() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    // === Axios Configuration === //
    axios.defaults.xsrfCookieName = 'csrftoken';
    axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
    axios.defaults.withCredentials = true;

    // === Axios Client === //
    const client = axios.create({
        baseURL: 'http://localhost:8000/'
    });

    // Check if the user is authenticated on mount
    // useEffect(() => {
    //     client.get("/api/user")
    //         .then(function (res) {
    //             setCurrentUser(res.data.user);
    //             setIsAuthenticated(true);
    //         })
    //         .catch(function (error) {
    //             setIsAuthenticated(false);
    //         });
    // }, []);

    useEffect(() => {
        checkAuth()
            .then(function (res) {
                setCurrentUser(res.user);
                setIsAuthenticated(true);
            })
            .catch(function (error) {
                setIsAuthenticated(false);
            });
    }, []);

    // If state of the user authentication changes, update the user context (on sign in)
    useEffect(() => {
        if (isAuthenticated) {
            checkAuth()
                .then(function (res) {
                    setCurrentUser(res.user);
                })
        }
    }, [isAuthenticated]);

    return (
        <UserContext.Provider value={{ client, currentUser, setCurrentUser, isAuthenticated, setIsAuthenticated }}>
            <Nav />
            {/* This is where the child routes will be rendered */}
            <Outlet />
        </UserContext.Provider>
    );
}