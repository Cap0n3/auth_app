import { Typography } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { UserContext } from '../routes/Root';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignIn = ({SignInState}) => {
    const { client, currentUser, setCurrentUser, isAuthenticated, setIsAuthenticated } = useContext(UserContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // Check if user state is updated and redirect to dashboard
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }
    , [isAuthenticated]);

    function submitLogin(e) {
        e.preventDefault();
        client.post(
            "/api/login",
            {
                email: email,
                password: password
            }
        ).then(function (res) {
            console.log("User is authenticated: ", isAuthenticated);
            console.log("Current user: ", currentUser);
            console.log("Response: ", res);
            setIsAuthenticated(true);
            //setCurrentUser(res.data);
        });
    }

    return(
        <div>
            <Typography variant="h5" gutterBottom>
                Sign In
            </Typography>
            <form onSubmit={e => submitLogin(e)}>
                <FormControl>
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
                </FormControl>
            </form>
        </div>
    );
}

export default SignIn;