import { createContext, useState, useEffect } from 'react';
import Nav from '../components/Common/Navbar';
import { Outlet } from 'react-router-dom';
import axios from 'axios';
import { checkAuth } from '../services/userservice';
import Container from '@mui/material/Container';
import { Box } from '@mui/material';

// Create a user context for the entire app
export const UserContext = createContext(null);

export default function Root() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    // Check if user is authenticated on page load
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
        <UserContext.Provider value={{ currentUser, setCurrentUser, isAuthenticated, setIsAuthenticated }}>
            <Nav />
            {/* This is where the child routes will be rendered */}
            <Container maxWidth="lg" sx={{ 
                mt: 4,
                display: 'flex',
                justifyContent: 'center',
                
            }}>
                <Outlet />
            </Container>
        </UserContext.Provider>
    );
}