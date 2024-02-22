import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useContext, useEffect } from 'react';
import { UserContext } from '../../main';
import { Link } from 'react-router-dom';


const Nav = () => {
    const { client, currentUser, setCurrentUser } = useContext(UserContext);

    function submitLogout(e) {
        e.preventDefault();
        client.post(
            "/api/logout",
            { withCredentials: true }
        ).then(function (res) {
            setCurrentUser(false);
            // REDIRECT TO LANDING PAGE (without react-router-dom)
            window.location.href = '/';
        });
    }

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
                    {currentUser ?
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