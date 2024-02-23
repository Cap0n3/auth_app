import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useContext, useEffect } from 'react';
import { UserContext } from '../../routes/Root';
import { Link, useNavigate } from 'react-router-dom';


const Nav = () => {
    const { client, currentUser, setCurrentUser, isAuthenticated, setIsAuthenticated } = useContext(UserContext);
    const navigate = useNavigate();

    function submitLogout(e) {
        e.preventDefault();
        client.post(
            "/api/logout",
            { withCredentials: true }
        ).then(function (res) {
            setIsAuthenticated(false);
            setCurrentUser(null);
            navigate('/');
        });
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
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Authentication App
                    </Typography>
                    <Typography variant="span" component="div" mr={3}>
                        {isAuthenticated && currentUser ? `Welcome, ${currentUser.username}` : ''}
                    </Typography>
                    {isAuthenticated ?
                        <Button variant="contained" onClick={e => submitLogout(e)}>Log out</Button> :
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