import { useContext, useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import Form from '../components/Common/Forms';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { UserContext } from '../routes/Root';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../services/userservice';
import { get_error_msg } from '../services/error_handlers';
import Alert from '@mui/material/Alert';

const SignUp = () => {
    // Get client from user context object
    const { setCurrentUser, isAuthenticated, setIsAuthenticated } = useContext(UserContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Check if user state is updated and redirect to dashboard
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }
    , [isAuthenticated]);

    const handleRegistration = async (e) => {
        e.preventDefault();
        try {
            const userData = await signup({ email, username, password });
            setIsAuthenticated(true);
            setCurrentUser(userData);
        } catch (error) {
            // FOR PROD -> Implement switch case to avoid revealing sensitive informations through error messages
            if (error.response) {
                const error_msg = get_error_msg(error.response);
                setError(error_msg);
            }
        }
    }
    
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            <Typography variant="h5" marginBottom={4}>
                Sign up
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
                    Sign Up
                </Button>
            </Form>
            <Link to="/signin">
                <Button variant="text" sx={{ mt: 2 }}>
                    Already have an account? Sign in
                </Button>
            </Link>
            <Box sx={{ width: '100%', mt: 2 }}>
                {error && <Alert severity="error">{error}</Alert>}
            </Box>
        </Box>        
    );
}

export default SignUp;