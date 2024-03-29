import { createContext, useState, useEffect } from 'react';
import Nav from '../components/Common/Navbar';
import { Outlet } from 'react-router-dom';
import { checkAuth } from '../services/userservice';
import Container from '@mui/material/Container';
import { getCsrfToken } from '../utils/misc_func';
import { debugLog } from '../utils/debug';

// Create a user context for the entire app
export const UserContext = createContext(null);

export default function Root() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [csrfToken, setCSRFToken] = useState('');

    // Check if user is authenticated on page load
    useEffect(() => {
        const csrf_token = getCsrfToken();
        debugLog('[Root.js] Checking authentication...');
        debugLog('[Root.js] CSRF Token:', csrf_token);

        checkAuth()
            .then(function (res) {
                setCurrentUser(res);
                setIsAuthenticated(true);
                setCSRFToken(csrf_token);
                debugLog('[Root.js] User authenticated:', res);
            })
            .catch(function (error) {
                setIsAuthenticated(false);
                console.error('Authentication error:', error);
            });
    }, []);

    return (
        <UserContext.Provider value={{ currentUser, setCurrentUser, isAuthenticated, setIsAuthenticated, csrfToken }}>
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