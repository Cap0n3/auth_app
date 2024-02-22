import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';

export default function Index() {
    return (
        <div>
            <Typography variant="h5" gutterBottom>
                Welcome to the Landing Page
            </Typography>
            <Typography variant="body1" gutterBottom>
                Not a member? Sign up now !
            </Typography>
            <Link to="/signup">
                <Button variant="contained">Sign Up</Button>
            </Link>
        </div>
    );
}
