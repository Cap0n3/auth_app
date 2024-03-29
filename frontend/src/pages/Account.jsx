import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../routes/Root';
import { BASE_URL } from '../services/userservice';
import Form from '../components/Common/Forms';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Collapse from '@mui/material/Collapse';
import { updateProfile, updatePassword } from '../services/userservice';
import { get_error_msg } from '../services/error_handlers';
import { debugLog } from '../utils/debug';


const Account = () => {
    const { currentUser, setCurrentUser, isAuthenticated, setIsAuthenticated, csrfToken } = useContext(UserContext);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [newImage, setNewImage] = useState(null);
    const [currentAvatar, setCurrAvatar] = useState(null);
    const [currentPassword, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [updateSuccess, setUpdateSuccess] = useState(false);

    useEffect(() => {
        debugLog('[Account.jsx] context:', currentUser);
        debugLog('[Account.jsx] csrfToken:', csrfToken);
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
            formData.append('email', email);
            formData.append('username', username);
            if (newImage) {
                formData.append('avatar', newImage);
            }

            const userData = await updateProfile(formData, csrfToken);
            // Update user context
            setCurrentUser(userData);
            setUpdateSuccess(true);
        } catch (error) {
            // FOR PROD -> Implement switch case to avoid revealing sensitive informations through error messages
            if (error.response) {
                const error_msg = get_error_msg(error.response);
                setError(error_msg);
            }
        }
    }

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        // Check if password and confirm password match
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        try {
            let formData = new FormData();
            formData.append('current_password', currentPassword);
            formData.append('new_password', password);
            const userData = await updatePassword(formData);
            setUpdateSuccess(true);
            console.log("Password updated successfully");
        }
        catch (error) {
            // FOR PROD -> Implement switch case to avoid revealing sensitive informations through error messages
            if (error.response) {
                const error_msg = get_error_msg(error.response);
                setError(error_msg);
            }
        }
    }

    // If user is already authenticated, populate email and username fields
    useEffect(() => {
        if (isAuthenticated) {
            setEmail(currentUser.email);
            setUsername(currentUser.username);
            setCurrAvatar(currentUser.avatar);
        }
    }, []);

    // Set a timer for success messages
    useEffect(() => {
        if (updateSuccess) {
            console.log("Update success");
            const timer = setTimeout(() => {
                setUpdateSuccess(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [updateSuccess]);

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            <Typography variant="h5" marginBottom={4}>
                Account
            </Typography>

            <Form onSubmit={e => handleSubmit(e)}>
                <Stack direction="column" alignItems="center" spacing={2}>
                    {/* {currentUser.avatar && <Avatar src={BASE_URL + currentUser.avatar} sx={{ width: 100, height: 100 }} />} */}
                    {newImage ? <Avatar src={URL.createObjectURL(newImage)} sx={{ width: 100, height: 100 }} /> : <Avatar src={BASE_URL + currentAvatar} sx={{ width: 100, height: 100 }} />}
                    <input
                        accept="image/*"
                        style={{ display: 'none' }}
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

                <Typography variant="h6" align='center' marginTop={4} marginBottom={4}>
                    Personal Information
                </Typography>

                <TextField
                    id="signup-email"
                    label="Email"
                    variant="outlined"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <TextField
                    id="signup-username"
                    label="Username"
                    variant="outlined"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
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

            <Form onSubmit={e => handlePasswordSubmit(e)}>
                <Typography variant="h6" align='center' marginTop={4} marginBottom={4}>
                    Change Password
                </Typography>
                <TextField
                    id="signup-current-password"
                    label="Current Password"
                    variant="outlined"
                    type="password"
                    onChange={e => setCurrentPassword(e.target.value)}
                />
                <TextField
                    id="signup-password"
                    label="Password"
                    variant="outlined"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <TextField
                    id="signup-confirm-password"
                    label="Confirm Password"
                    variant="outlined"
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
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
            <Box sx={{ width: '100%', mt: 2 }}>
                <Collapse in={updateSuccess}>
                    <Alert severity="success">Profile updated successfully</Alert>
                </Collapse>
                <Collapse in={error !== null ? true : false}>
                    <Alert 
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                                setError(null);
                            }}
                            >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                    severity="error">{error}</Alert>
                </Collapse>
            </Box>
        </Box>
    );
};

export default Account;