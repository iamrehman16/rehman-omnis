import React, { useState } from 'react';
import { Button, Box, Typography, Paper, Alert, CircularProgress } from '@mui/material';
import { AdminPanelSettings } from '@mui/icons-material';
import { initializeAdmin } from '../../utils/makeAdmin';

const AdminInitializer = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInitializeAdmin = async () => {
    setLoading(true);
    setMessage('');
    try {
      await initializeAdmin();
      setSuccess(true);
      setMessage('Admin initialized successfully! Please refresh the page to see the Admin tab.');
    } catch (error) {
      setSuccess(false);
      setMessage('Failed to initialize admin: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3, maxWidth: 500, mx: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <AdminPanelSettings color="primary" />
        <Typography variant="h6">
          Admin Setup
        </Typography>
      </Box>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Make yourself an admin to access the admin panel and manage users.
      </Typography>
      
      <Typography variant="body2" sx={{ mb: 3, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
        Admin Email: {import.meta.env.VITE_ADMIN_EMAIL}
      </Typography>

      {message && (
        <Alert severity={success ? 'success' : 'error'} sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleInitializeAdmin}
        disabled={loading || success}
        fullWidth
        startIcon={loading ? <CircularProgress size={20} /> : <AdminPanelSettings />}
      >
        {loading ? 'Initializing...' : success ? 'Admin Initialized!' : 'Make Me Admin'}
      </Button>

      {success && (
        <Typography variant="caption" display="block" sx={{ mt: 1, textAlign: 'center', color: 'text.secondary' }}>
          Refresh the page to see the Admin tab in the navigation
        </Typography>
      )}
    </Paper>
  );
};

export default AdminInitializer;