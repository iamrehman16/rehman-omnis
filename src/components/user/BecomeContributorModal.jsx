import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Alert
} from '@mui/material';
import { Close, Add } from '@mui/icons-material';

const availableSpecialties = [
  'Computer Science',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'English Literature',
  'History',
  'Economics',
  'Business Studies',
  'Statistics',
  'Environmental Science',
  'Psychology',
  'Philosophy',
  'Engineering',
  'Medicine',
  'Law',
  'Art & Design',
  'Music',
  'Languages'
];

const BecomeContributorModal = ({ open, onClose, onSubmit, isSubmitting, isAdminMode = false }) => {
  const [formData, setFormData] = useState({
    specialties: [],
    bio: ''
  });
  const [errors, setErrors] = useState({});

  const handleSpecialtyChange = (event) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      specialties: typeof value === 'string' ? value.split(',') : value
    }));
    
    if (errors.specialties) {
      setErrors(prev => ({ ...prev, specialties: '' }));
    }
  };

  const handleBioChange = (event) => {
    setFormData(prev => ({
      ...prev,
      bio: event.target.value
    }));
    
    if (errors.bio) {
      setErrors(prev => ({ ...prev, bio: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (formData.specialties.length === 0) {
      newErrors.specialties = 'Please select at least one specialty';
    }
    
    if (!formData.bio.trim()) {
      newErrors.bio = 'Please provide a bio describing your expertise';
    } else if (formData.bio.trim().length < 20) {
      newErrors.bio = 'Bio should be at least 20 characters long';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      await onSubmit(formData.specialties, formData.bio);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({ specialties: [], bio: '' });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          {isAdminMode ? 'Set Contributor Details' : 'Become a Contributor'}
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        <Alert severity="info" sx={{ mb: 3 }}>
          {isAdminMode 
            ? 'Set the specialties and bio for this contributor. They will appear on the Ask page once saved.'
            : 'Submit your contributor application to be featured on the Ask page. An admin will review your request and approve it if you meet the requirements.'
          }
        </Alert>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <FormControl fullWidth error={!!errors.specialties}>
            <InputLabel>Your Specialties</InputLabel>
            <Select
              multiple
              value={formData.specialties}
              onChange={handleSpecialtyChange}
              input={<OutlinedInput label="Your Specialties" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
            >
              {availableSpecialties.map((specialty) => (
                <MenuItem key={specialty} value={specialty}>
                  {specialty}
                </MenuItem>
              ))}
            </Select>
            {errors.specialties && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                {errors.specialties}
              </Typography>
            )}
          </FormControl>
          
          <TextField
            fullWidth
            label="Bio"
            multiline
            rows={4}
            value={formData.bio}
            onChange={handleBioChange}
            error={!!errors.bio}
            helperText={errors.bio || 'Describe your expertise, experience, and how you can help other students (minimum 20 characters)'}
            placeholder="I'm a Computer Science student with 3+ years of programming experience. I specialize in algorithms, data structures, and web development. I love helping fellow students understand complex concepts and solve coding challenges..."
          />

          {!isAdminMode && (
            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                What happens next?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Your request will be submitted for admin review
                • An admin will evaluate your qualifications
                • If approved, you'll become a contributor
                • Your profile will then appear on the Ask page
                • Students can start conversations with you
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} color="inherit" disabled={isSubmitting}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={isSubmitting}
        >
          {isSubmitting 
            ? (isAdminMode ? 'Saving Details...' : 'Submitting Request...') 
            : (isAdminMode ? 'Save Details' : 'Submit Request')
          }
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BecomeContributorModal;