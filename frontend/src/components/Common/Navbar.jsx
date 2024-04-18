import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useContext, useState } from "react";
import { UserContext } from "../../routes/Root";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../services/userservice";

const settings = ["Account", "Dashboard", "Logout"];

const Nav = () => {
    const { currentUser, setCurrentUser, isAuthenticated, setIsAuthenticated } =
        useContext(UserContext);
    const navigate = useNavigate();
    const [anchorElUser, setAnchorElUser] = useState(null);

    const handleLogout = async () => {
        try {
            await logout();
            setIsAuthenticated(false);
            setCurrentUser(null);
            navigate("/");
        } catch (error) {
            console.error("Logout failed:", error.message);
        }
    };

    // === USER MENU === //

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleMenuClick = (setting) => {
        switch (setting) {
            case "Dashboard":
                navigate("/dashboard");
                break;
            case "Logout":
                handleLogout();
                break;
            case "Account":
                navigate("/account");
                break;
            default:
                break;
        }

        handleCloseUserMenu();
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        <Link
                            to="/"
                            style={{ textDecoration: "none", color: "white" }}
                        >
                            AUTH APP
                        </Link>
                    </Typography>
                    <Typography variant="span" component="div" mr={3}>
                        {isAuthenticated && currentUser
                            ? `Welcome, ${currentUser.username}`
                            : ""}
                    </Typography>

                    {/* === PROFILE AVATAR OR SIGN IN === */}
                    {isAuthenticated && currentUser ? (
                        // If user is authenticated, show the user avatar
                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Open settings">
                                <IconButton
                                    onClick={handleOpenUserMenu}
                                    sx={{ p: 0 }}
                                >
                                    <Avatar
                                        alt="Profile Pic"
                                        src={`${currentUser.avatar}`}
                                    />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: "45px" }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                {settings.map((setting) => (
                                    <MenuItem
                                        key={setting}
                                        onClick={() => handleMenuClick(setting)}
                                    >
                                        <Typography textAlign="center">
                                            {setting}
                                        </Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                    ) : (
                        // If user is not authenticated, show the sign in button
                        <Link to="/signin">
                            <Button variant="contained">Sign In</Button>
                        </Link>
                    )}
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default Nav;
