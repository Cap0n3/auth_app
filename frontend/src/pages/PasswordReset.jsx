import { useState } from "react";
import { useLocation } from "react-router-dom";
import Form from "../components/Common/Forms";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MessageBox from "../components/Common/MessageBox";
import { debugLog } from "../utils/debug";
import {
    extractResponseErrors,
    formatErrorMessages,
} from "../services/error_handlers";
import { resetUserPassword } from "../services/userservice";

const PasswordReset = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [success, setSuccess] = useState({ state: false, message: "" });
    const [error, setError] = useState({ state: false, message: "" });
    // Get query parameters from URL
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    const uid = queryParams.get("uid");

    if (!token || !uid) {
        return (
            <Box>
                <Typography variant="h5">404 - Page Not Found</Typography>
            </Box>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmNewPassword) {
            setError({
                state: true,
                message: "Passwords do not match",
            });
            return;
        }
        // TODO: Implement password reset logic here
        debugLog("Resetting password for:", uid);
        try {
            let formData = new FormData();
            formData.append("new_password", newPassword);
            formData.append("confirm_password", confirmNewPassword);
            formData.append("uid", uid);
            formData.append("token", token);
            const response = await resetUserPassword(formData);
            setSuccess({
                state: true,
                message: "Password reset successfully.",
            });
            debugLog("Password reset:", response);
        } catch (error) {
            setError({
                state: true,
                message: formatErrorMessages(extractResponseErrors(error.response)),
            });
            console.error("Error resetting password");
        }
    };

    const handleCloseMessageBox = () => {
        setSuccess({ state: false, message: "" });
        setError({ state: false, message: "" });
    };

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
                Password Reset
            </Typography>

            <Form onSubmit={handleSubmit}>
                <TextField
                    id="new-password"
                    label="New Password"
                    variant="outlined"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    fullWidth
                    required
                />
                <TextField
                    id="confirm-new-password"
                    label="Confirm New Password"
                    variant="outlined"
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    fullWidth
                    required
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                >
                    Reset Password
                </Button>
            </Form>

            <MessageBox
                status={{ success: success.state, error: error.state }}
                message={ success.message || error.message }
                onClose={handleCloseMessageBox}
            />
        </Box>
    );
};

export default PasswordReset;
