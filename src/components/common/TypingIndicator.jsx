import React from 'react';
import { Box, Typography } from '@mui/material';

const TypingIndicator = ({ isVisible, userName }) => {
  if (!isVisible) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        p: 1,
        color: 'text.secondary'
      }}
    >
      <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
        {userName} is typing
      </Typography>
      <Box
        sx={{
          display: 'flex',
          gap: 0.3,
          alignItems: 'center'
        }}
      >
        {[0, 1, 2].map((index) => (
          <Box
            key={index}
            sx={{
              width: 4,
              height: 4,
              borderRadius: '50%',
              backgroundColor: 'text.secondary',
              animation: 'typingDot 1.4s infinite ease-in-out',
              animationDelay: `${index * 0.16}s`,
              '@keyframes typingDot': {
                '0%, 80%, 100%': {
                  opacity: 0.3,
                  transform: 'scale(0.8)'
                },
                '40%': {
                  opacity: 1,
                  transform: 'scale(1)'
                }
              }
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default TypingIndicator;