import { createContext, useState, useEffect } from 'react';
import Nav from '../components/Common/Navbar';
import { Outlet } from 'react-router-dom';
import axios from 'axios';

// Create a user context
export const UserContext = createContext(null);

export default function Root() {
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

    return (
        <UserContext.Provider value={{ currentUser, setCurrentUser, client }}>
            <Nav />
            {/* This is where the child routes will be rendered */}
            <Outlet />
        </UserContext.Provider>
    );
}