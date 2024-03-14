import '../assets/global.css';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Form from '../components/Common/Forms';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { UserContext } from '../routes/root';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/userservice';
import { Link } from 'react-router-dom';
import { get_error_msg } from '../services/error_handlers';
import Alert from '@mui/material/Alert';

const SignIn = () => {
    const { currentUser, setCurrentUser, isAuthenticated, setIsAuthenticated } = useContext(UserContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Check if user state is updated and redirect to dashboard
    useEffect(() => {
        if (isAuthenticated) {
            console.log('Sign In page -> User is already authenticated, redirecting to dashboard');
            navigate('/dashboard');
        }
    }
    , [isAuthenticated, currentUser]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const userData = await login({ email, password });
            console.log('User logged in:', userData);
            setCurrentUser(userData);
            setIsAuthenticated(true);
            navigate('/dashboard');
        } catch (error) {
            // FOR PROD -> Implement switch case to avoid revealing sensitive informations through error messages
            if (error.response) {
                const error_msg = get_error_msg(error.response);
                setError(error_msg);
            }
        }
    };

    return(
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            <Typography variant="h5" marginBottom={4}>
                Sign In
            </Typography>
            <Form onSubmit={e => handleLogin(e)}>
                <TextField 
                    id="signup-email" 
                    label="Email" 
                    variant="outlined"
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
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
                    Sign In
                </Button>    
            </Form>
            <Link to="/signup">
                <Button variant="text" sx={{ mt: 2 }}>
                    Not a member ? Sign up now !
                </Button>
            </Link>
            <Box sx={{ width: '100%', mt: 2 }}>
                {error && <Alert severity="error">{error}</Alert>}
            </Box>
        </Box>
    );
}

export default SignIn;