import React, { useState } from 'react';
import { Paper, Typography, IconButton } from '@mui/material/';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const Dashboard  = () => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <Paper style={{ padding: '20px', marginBottom: '20px', backgroundColor: '#f0f0f0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <Typography variant="h6">DASHBOARD</Typography>
          <Typography variant="subtitle1">Hello, here your dashboard content</Typography>
        </div>
        <IconButton onClick={toggleExpanded}>
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </div>
      {expanded && <Typography variant="body2">More information about your dashboard and its content plus some other details</Typography>}
    </Paper>
  );
};

export default Dashboard;