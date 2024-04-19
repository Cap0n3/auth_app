import React from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

/**
 * Displays a collapsible alert box for success or error messages using Material-UI components.
 * It shows either a success or error alert based on the status object provided.
 *
 * @param {object} status - Object containing flags to determine the alert type.
 *                          It should have a `success` key that is truthy if the message is a success message,
 *                          and an `error` key that is truthy if the message is an error message.
 * @param {string} message - The message to be displayed inside the alert.
 * @param {Function} onClose - Function to call when the close button of the alert is clicked.
 *                             This should typically update a state in the parent component to control the visibility.
 *
 * @example
 * // In a parent component, setup state and handlers to control the MessageBox:
 * const [success, setSuccess] = useState(null);
 * const [error, setError] = useState(null);
 *
 * // Create a function to handle closing the MessageBox (updating the state):
 * const handleClose = () => {
 *   setMessageType(null);
 *   setMessage("");
 * };
 *
 * // Usage of MessageBox component:
 * <MessageBox
 *  status={{ success, error: !!error }}
 *  message={ error || success }
 *  onClose={ handleCloseMessageBox }
 * />
 *
 * @returns {JSX.Element} A Material-UI Box component containing a Collapsible Alert for either success or error messages.
 */
const MessageBox = ({ status, message, onClose }) => {

    // Avoid excessive rendering
    if (!status.success && !status.error) {
        return null;
    }

    return (
        <Box sx={{ width: "100%", mt: 2 }}>
            <Collapse in={status.success}>
                <Alert severity="success">{message}</Alert>
            </Collapse>
            <Collapse in={status.error}>
                <Alert
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                                onClose();
                            }}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                    severity="error"
                >
                    {message}
                </Alert>
            </Collapse>
        </Box>
    );
};

export default MessageBox;
