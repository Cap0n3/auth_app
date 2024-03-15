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
import { updateProfile } from '../services/userservice';
import { get_error_msg } from '../services/error_handlers';


const Account = () => {
    const { currentUser, setCurrentUser, isAuthenticated, setIsAuthenticated } = useContext(UserContext);
    const [error, setError] = useState(null);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [newImage, setNewImage] = useState(null);
    const [currentAvatar, setCurrAvatar] = useState(null);
    const [updateSuccess, setUpdateSuccess] = useState(false);

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

            const userData = await updateProfile(formData);
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

    // If user is already authenticated, populate email and username fields
    useEffect(() => {
        if (isAuthenticated) {
            setEmail(currentUser.email);
            setUsername(currentUser.username);
            setCurrAvatar(currentUser.avatar);
        }

        return () => {
            console.log("Unmounting Account component")
        }
    }, []);

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
            <Box sx={{ width: '100%', mt: 2 }}>
                {error && <Alert severity="error">{error}</Alert>}
                {updateSuccess && <Alert severity="success">Profile updated successfully</Alert>}
            </Box>
        </Box>
    );
};

export default Account;