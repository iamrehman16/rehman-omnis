import React from 'react';
import { Box, Typography } from '@mui/material';
import { Check as CheckIcon, DoneAll as DoneAllIcon } from '@mui/icons-material';

const ReadReceiptIndicator = ({ status, timestamp }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'sent':
        return <CheckIcon sx={{ fontSize: 12, opacity: 0.6 }} />;
      case 'delivered':
        return <DoneAllIcon sx={{ fontSize: 12, opacity: 0.6 }} />;
      case 'read':
        return <DoneAllIcon sx={{ fontSize: 12, color: 'primary.main' }} />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'sent':
        return 'Sent';
      case 'delivered':
        return 'Delivered';
      case 'read':
        return 'Read';
      default:
        return '';
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        opacity: 0.7,
        fontSize: '0.7rem'
      }}
    >
      {getStatusIcon()}
      <Typography
        variant="caption"
        sx={{
          fontSize: '0.7rem',
          color: status === 'read' ? 'primary.main' : 'inherit'
        }}
      >
        {timestamp ? timestamp : getStatusText()}
      </Typography>
    </Box>
  );
};

export default ReadReceiptIndicator;