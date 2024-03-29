import React, { useState } from 'react';
import { Paper, Typography, IconButton, Box } from '@mui/material/';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { debugLog } from '../utils/debug';

const Dashboard = () => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
    }}>
      <Paper sx={{
        padding: 2, // Equivalent to 16px if the default theme spacing is 8 (theme.spacing(2))
        marginBottom: 2.5, // Equivalent to 20px if the default theme spacing is 8 (theme.spacing(2.5))
        backgroundColor: 'grey',
        width: '100%',
      }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <Box>
            <Typography variant="h6">DASHBOARD</Typography>
            <Typography variant="subtitle1">Hello, here your dashboard content</Typography>
          </Box>
          <IconButton onClick={toggleExpanded}>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
        {expanded && (
          <Typography variant="body2" sx={{ mt: 2 }}>
            More information about your dashboard and its content plus some other details
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default Dashboard;