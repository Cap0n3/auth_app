import { useContext, useState, useEffect } from "react";
import { UserContext } from "../routes/Root";
import Form from "../components/Common/Forms";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import MessageBox from "../components/Common/MessageBox";
import { updateProfile, updatePassword } from "../services/userservice";
import {
    extractResponseErrors,
    formatErrorMessages,
} from "../services/error_handlers";
import { debugLog } from "../utils/debug";

const Account = () => {
    const {
        currentUser,
        setCurrentUser,
        isAuthenticated,
        setIsAuthenticated,
        csrfToken,
    } = useContext(UserContext);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [newImage, setNewImage] = useState(null);
    const [currentAvatar, setCurrAvatar] = useState(null);
    const [currentPassword, setCurrentPassword] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState({ state: false, message: "" });
    const [updateSuccess, setUpdateSuccess] = useState({ state: false, message: "" });

    useEffect(() => {
        debugLog("[Account.jsx] context:", currentUser);
        debugLog("[Account.jsx] csrfToken:", csrfToken);
    }, []);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setNewImage(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let formData = new FormData();
            formData.append("email", email);
            formData.append("username", username);
            if (newImage) {
                formData.append("avatar", newImage);
            }

            const userData = await updateProfile(formData, csrfToken);
            // Update user context
            setCurrentUser(userData);
            setUpdateSuccess({ state: true, message: "Profile updated successfully" });
        } catch (error) {
            // FOR PROD -> Implement switch case to avoid revealing sensitive informations through error messages
            if (error.response) {
                setError({
                    state: true,
                    message: formatErrorMessages(extractResponseErrors(error.response)),
                });
            }
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError({ state: true, message: "Passwords do not match" });
            return;
        }
        try {
            let formData = new FormData();
            formData.append("old_password", currentPassword);
            formData.append("new_password", password);
            const userData = await updatePassword(formData);
            setUpdateSuccess({ state: true, message: "Password updated successfully" });
        } catch (error) {
            // FOR PROD -> Implement switch case to avoid revealing sensitive informations through error messages
            if (error.response) {
                setError({
                    state: true,
                    message: formatErrorMessages(extractResponseErrors(error.response)),
                });
            }
        }
    };

    const handleCloseMessageBox = () => {
        setUpdateSuccess({ state: false, message: "" });
        setError({ state: false, message: "" });
    };

    // If user is already authenticated, populate email and username fields
    useEffect(() => {
        if (isAuthenticated) {
            debugLog("[Account.jsx] User is authenticated:", currentUser);
            setEmail(currentUser.email);
            setUsername(currentUser.username);
            setCurrAvatar(currentUser.avatar);
        }
    }, []);

    // Set a timer for success messages
    useEffect(() => {
        if (updateSuccess.state) {
            console.log("Update success");
            const timer = setTimeout(() => {
                setUpdateSuccess({ state: false, message: "" });
            }, 6000);
            return () => clearTimeout(timer);
        }
    }, [updateSuccess.state]);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minWidth: 300,
            }}
        >
            <Typography variant="h5" marginBottom={4}>
                Account
            </Typography>

            <Form onSubmit={(e) => handleSubmit(e)}>
                <Stack direction="column" alignItems="center" spacing={2}>
                    {newImage ? (
                        <Avatar
                            src={URL.createObjectURL(newImage)}
                            sx={{ width: 100, height: 100 }}
                        />
                    ) : (
                        <Avatar
                            src={currentAvatar}
                            sx={{ width: 100, height: 100 }}
                        />
                    )}
                    <input
                        accept="image/*"
                        style={{ display: "none" }}
                        id="raised-button-file"
                        multiple
                        type="file"
                        onChange={handleImageChange}
                    />
                    <label htmlFor="raised-button-file">
                        <Button variant="contained" component="span">
                            Upload Image
                        </Button>
                    </label>
                </Stack>

                <Typography
                    variant="h6"
                    align="center"
                    marginTop={4}
                    marginBottom={4}
                >
                    Personal Information
                </Typography>

                <TextField
                    id="account-email"
                    label="Email"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    required
                />
                <TextField
                    id="account-username"
                    label="Username"
                    variant="outlined"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    fullWidth
                    required
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                >
                    Save changes
                </Button>
            </Form>

            <Form onSubmit={(e) => handlePasswordSubmit(e)}>
                <Typography
                    variant="h6"
                    align="center"
                    marginTop={4}
                    marginBottom={4}
                >
                    Change Password
                </Typography>
                <TextField
                    id="account-current-password"
                    label="Current Password"
                    variant="outlined"
                    type="password"
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    fullWidth
                    required
                />
                <TextField
                    id="account-password"
                    label="Password"
                    variant="outlined"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    required
                />
                <TextField
                    id="account-confirm-password"
                    label="Confirm Password"
                    variant="outlined"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    fullWidth
                    required
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                >
                    Change Password
                </Button>
            </Form>
            <MessageBox
                status={{ success: updateSuccess.state, error: error.state }}
                message={ updateSuccess.message || error.message }
                onClose={handleCloseMessageBox}
            />
        </Box>
    );
};

export default Account;
