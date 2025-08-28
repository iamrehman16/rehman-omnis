import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  Chip,
  Grid,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Person,
  Schedule
} from '@mui/icons-material';
import userService from '../../services/user.service';

const PendingRequests = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState({});
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, action: null, user: null });

  useEffect(() => {
    loadPendingRequests();
  }, []);

  const loadPendingRequests = async () => {
    setLoading(true);
    try {
      const result = await userService.getPendingContributorRequests();
      if (result.success) {
        setPendingRequests(result.data);
      }
    } catch (error) {
      console.error('Error loading pending requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    setProcessing(prev => ({ ...prev, [userId]: true }));
    try {
      const result = await userService.approveContributorRequest(userId);
      if (result.success) {
        setPendingRequests(prev => prev.filter(req => req.id !== userId));
        alert('Contributor request approved successfully!');
      } else {
        alert(result.message || 'Failed to approve request');
      }
    } catch (error) {
      console.error('Error approving request:', error);
      alert('Error approving request');
    } finally {
      setProcessing(prev => ({ ...prev, [userId]: false }));
      setConfirmDialog({ open: false, action: null, user: null });
    }
  };

  const handleReject = async (userId) => {
    setProcessing(prev => ({ ...prev, [userId]: true }));
    try {
      const result = await userService.rejectContributorRequest(userId);
      if (result.success) {
        setPendingRequests(prev => prev.filter(req => req.id !== userId));
        alert('Contributor request rejected');
      } else {
        alert(result.message || 'Failed to reject request');
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Error rejecting request');
    } finally {
      setProcessing(prev => ({ ...prev, [userId]: false }));
      setConfirmDialog({ open: false, action: null, user: null });
    }
  };

  const openConfirmDialog = (action, user) => {
    setConfirmDialog({ open: true, action, user });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({ open: false, action: null, user: null });
  };

  const executeAction = () => {
    if (confirmDialog.action === 'approve') {
      handleApprove(confirmDialog.user.id);
    } else if (confirmDialog.action === 'reject') {
      handleReject(confirmDialog.user.id);
    }
  };

  const getSpecialtyColor = (specialty) => {
    const colors = {
      'Computer Science': 'primary',
      'Mathematics': 'secondary',
      'Physics': 'info',
      'Chemistry': 'success',
      'English Literature': 'warning',
      'History': 'error',
      'Statistics': 'secondary',
      'Biology': 'success',
      'Environmental Science': 'info',
      'Economics': 'warning',
      'Business Studies': 'primary'
    };
    return colors[specialty] || 'default';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Pending Contributor Requests
      </Typography>

      {pendingRequests.length === 0 ? (
        <Alert severity="info">
          No pending contributor requests at the moment.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {pendingRequests.map((request) => (
            <Grid item xs={12} md={6} lg={4} key={request.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 3
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  {/* Header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      src={request.avatar}
                      sx={{ 
                        width: 50, 
                        height: 50, 
                        mr: 2,
                        bgcolor: 'primary.main'
                      }}
                    >
                      {request.name.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {request.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {request.email}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Request Info */}
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Schedule fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        Requested: {request.requestDate?.toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Person fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        Joined: {request.joinedDate?.toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Specialties */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                      Specialties:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {request.specialties.map((specialty) => (
                        <Chip
                          key={specialty}
                          label={specialty}
                          size="small"
                          color={getSpecialtyColor(specialty)}
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>

                  {/* Bio */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                      Bio:
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {request.bio}
                    </Typography>
                  </Box>

                  {/* Action Buttons */}
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="success"
                      startIcon={<CheckCircle />}
                      onClick={() => openConfirmDialog('approve', request)}
                      disabled={processing[request.id]}
                      size="small"
                    >
                      Approve
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      color="error"
                      startIcon={<Cancel />}
                      onClick={() => openConfirmDialog('reject', request)}
                      disabled={processing[request.id]}
                      size="small"
                    >
                      Reject
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onClose={closeConfirmDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {confirmDialog.action === 'approve' ? 'Approve Contributor Request' : 'Reject Contributor Request'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to {confirmDialog.action} the contributor request from{' '}
            <strong>{confirmDialog.user?.name}</strong>?
          </Typography>
          {confirmDialog.action === 'approve' && (
            <Alert severity="info" sx={{ mt: 2 }}>
              This user will become a contributor and appear on the Ask page.
            </Alert>
          )}
          {confirmDialog.action === 'reject' && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              This user will remain a student and their request data will be cleared.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmDialog} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={executeAction} 
            variant="contained"
            color={confirmDialog.action === 'approve' ? 'success' : 'error'}
            disabled={processing[confirmDialog.user?.id]}
          >
            {processing[confirmDialog.user?.id] ? 'Processing...' : 
             confirmDialog.action === 'approve' ? 'Approve' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PendingRequests;