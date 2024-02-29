import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useContext, useEffect } from 'react';
import { UserContext } from '../../routes/root';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../services/userservice';


const Nav = () => {
    const { client, currentUser, setCurrentUser, isAuthenticated, setIsAuthenticated } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            await logout();
            setIsAuthenticated(false);
            setCurrentUser(null);
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error.message);
        }
    }

    useEffect(() => {
        if (isAuthenticated) {
            console.log("User is authenticated: ", isAuthenticated);
            console.log("Current user: ", currentUser);
        }
    }, [isAuthenticated]);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>AUTH APP</Link>
                    </Typography>
                    <Typography variant="span" component="div" mr={3}>
                        {isAuthenticated && currentUser ? `Welcome, ${currentUser.username}` : ''}
                    </Typography>
                    {isAuthenticated ?
                        <Button variant="contained" onClick={e => handleLogout(e)}>Log out</Button> :
                        <Link to="/signin">
                            <Button variant="contained">Sign In</Button>
                        </Link>
                    }
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default Nav;