import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert
} from '@mui/material';
import { Warning } from '@mui/icons-material';

const DeleteConfirmationDialog = ({ open, onClose, onConfirm, resource, isDeleting }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Warning color="error" />
        <Typography variant="h6">Delete Resource</Typography>
      </DialogTitle>
      
      <DialogContent>
        <Alert severity="warning" sx={{ mb: 2 }}>
          This action cannot be undone. The resource will be permanently deleted.
        </Alert>
        
        <Typography variant="body1" gutterBottom>
          Are you sure you want to delete this resource?
        </Typography>
        
        {resource && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {resource.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {resource.subject} - Semester {resource.semester}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Type: {resource.type}
            </Typography>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} color="inherit" disabled={isDeleting}>
          Cancel
        </Button>
        <Button 
          onClick={onConfirm} 
          variant="contained" 
          color="error"
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete Resource'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;