import React, { useState } from 'react';
import Form from '../components/Common/Forms';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import MessageBox from '../components/Common/MessageBox';
import { sendResetPasswordEmail } from '../services/userservice';
import { extractResponseErrors, formatErrorMessages } from '../services/error_handlers';
import { debugLog } from '../utils/debug';

function SendResetPassword() {
    const [email, setEmail] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // TODO: Implement password reset logic here
        debugLog('Sending password reset email to:', email);
        sendResetPasswordEmail({ email })
            .then(function (res) {
                setSuccess("Password reset email sent successfully. Check your inbox.");
                debugLog('Password reset email sent:', res);
            })
            .catch(function (error) {
                setError(
                    formatErrorMessages(
                        extractResponseErrors(error.response)
                    )
                );
                console.error('Error sending password reset email:', error);
            });
    };

    const handleCloseMessageBox = () => {
        setSuccess(false);
        setError(null);
    }

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            <Typography variant="h5" marginBottom={4}>
                Forgot Password ?
            </Typography>
            <Typography variant="body1" marginBottom={2}>
                Enter your email address below to receive a password reset link.
            </Typography>
            <Form onSubmit={handleSubmit}>
                <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    fullWidth
                    required
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                >
                    Send Reset Password Email
                </Button>
            </Form>
            <MessageBox 
                status={{ success, error: !!error }} 
                message={error || success}
                onClose={handleCloseMessageBox} 
            />
        </Box>
    );
}

export default SendResetPassword;