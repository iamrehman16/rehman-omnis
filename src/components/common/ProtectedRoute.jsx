// src/components/common/ProtectedRoute.js
import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, fallback = null }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while checking auth status
  if (isLoading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        gap={2}
      >
        <CircularProgress size={40} />
        <Typography variant="body1" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    );
  }

  // Show fallback component if not authenticated
  if (!isAuthenticated) {
    return fallback;
  }

  // Render children if authenticated
  return children;
};

export default ProtectedRoute;

// src/components/common/AuthGuard.js - Alternative approach
export const AuthGuard = ({ children, redirectTo = '/login' }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    // In a real app, you'd use React Router to redirect
    // For now, return null or a login prompt
    return null;
  }

  return children;
};