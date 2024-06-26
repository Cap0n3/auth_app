import '../assets/global.css';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Form from '../components/Common/Forms';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { UserContext } from '../routes/Root';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/userservice';
import { Link } from 'react-router-dom';
import { extractResponseErrors, formatErrorMessages } from '../services/error_handlers';
import Alert from '@mui/material/Alert';
import { debugLog } from '../utils/debug';

const SignIn = () => {
    const { currentUser, setCurrentUser, isAuthenticated, setIsAuthenticated } = useContext(UserContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Check if user state is updated and redirect to dashboard
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }
    , [isAuthenticated, currentUser]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const userData = await login({ email, password });
            setCurrentUser(userData);
            setIsAuthenticated(true);
            debugLog('[SignIn.js] User logged in:', userData);
            navigate('/dashboard');
        } catch (error) {
            // FOR PROD -> Implement switch case to avoid revealing sensitive informations through error messages
            if (error.response) {
                setError(
                    formatErrorMessages(
                        extractResponseErrors(error.response)
                    )
                );
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