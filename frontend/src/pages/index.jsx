import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";

export default function Index() {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
            }}
        >
            <Typography variant="h5" gutterBottom>
                Welcome to the Landing Page
            </Typography>
            <Typography variant="body1" gutterBottom>
                Not a member? Sign up now !
            </Typography>
            <Link to="/signup">
                <Button variant="contained">Sign Up</Button>
            </Link>
        </Box>
    );
}
