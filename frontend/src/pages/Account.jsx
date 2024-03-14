import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../routes/root';
import { Link, useNavigate } from 'react-router-dom';
import Form from '../components/Common/Forms';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';


const Account = () => {
    const { currentUser, setCurrentUser, isAuthenticated, setIsAuthenticated } = useContext(UserContext);
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // If user is already authenticated, populate email and username fields
    useEffect(() => {
        if (isAuthenticated) {
            setEmail(currentUser.email);
            setUsername(currentUser.username);
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
            <Form onSubmit={e => handleRegistration(e)}>
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
                <TextField
                    id="outlined-password-input"
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    variant="outlined"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
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
            </Box>
        </Box>
    );
};

export default Account;