import { useContext, useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { UserContext } from '../routes/Root';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    // Get client from user context object
    const { client, currentUser, setCurrentUser, isAuthenticated, setIsAuthenticated } = useContext(UserContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Check if user state is updated and redirect to dashboard
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }
    , [isAuthenticated]);
    

    function submitRegistration(e) {
        e.preventDefault();

        console.log("email: ", email);
        console.log("username: ", username);
        console.log("password: ", password);
        
        client.post(
            "/api/register",
            {
                email: email,
                username: username,
                password: password
            }
        ).then(function (res) {
            client.post(
                "/api/login",
                {
                    email: email,
                    password: password
                }
            ).then(function (res) {
                setIsAuthenticated(true);
                setCurrentUser(res.data.user);
            });
        });
    }
    
    return (
        <div>
            <Typography variant="h5" gutterBottom>
                Sign up
            </Typography>
            <form onSubmit={e => submitRegistration(e)}>
                <FormControl>
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
                </FormControl>
            </form>
        </div>
    );
}

export default SignUp;