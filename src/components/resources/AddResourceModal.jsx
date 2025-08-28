import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  IconButton,
  CircularProgress
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { RESOURCE_TYPES, SEMESTERS, ALL_SUBJECTS } from '../../utils/dataStructures';

const AddResourceModal = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    resourceUrl: '',
    subject: '',
    semester: ''
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.type) newErrors.type = 'Type is required';
    if (!formData.resourceUrl.trim()) newErrors.resourceUrl = 'Resource URL is required';
    if (!formData.subject) newErrors.subject = 'Subject is required';
    if (!formData.semester) newErrors.semester = 'Semester is required';
    
    // Validate URL format (basic check for Google Drive)
    if (formData.resourceUrl && !formData.resourceUrl.includes('drive.google.com')) {
      newErrors.resourceUrl = 'Please provide a valid Google Drive URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await onSubmit(formData);
        handleClose();
      } catch (error) {
        console.error('Error submitting resource:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      type: '',
      resourceUrl: '',
      subject: '',
      semester: ''
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Add New Resource</Typography>
        <IconButton onClick={handleClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            fullWidth
            label="Resource Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name}
            required
          />
          
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            error={!!errors.description}
            helperText={errors.description}
            multiline
            rows={3}
            required
          />
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth error={!!errors.type}>
              <InputLabel>Resource Type</InputLabel>
              <Select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                label="Resource Type"
                required
              >
                {RESOURCE_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
              {errors.type && <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>{errors.type}</Typography>}
            </FormControl>
            
            <FormControl fullWidth error={!!errors.semester}>
              <InputLabel>Semester</InputLabel>
              <Select
                name="semester"
                value={formData.semester}
                onChange={handleInputChange}
                label="Semester"
                required
              >
                {SEMESTERS.map((sem) => (
                  <MenuItem key={sem} value={sem}>
                    Semester {sem}
                  </MenuItem>
                ))}
              </Select>
              {errors.semester && <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>{errors.semester}</Typography>}
            </FormControl>
          </Box>
          
          <FormControl fullWidth error={!!errors.subject}>
            <InputLabel>Subject</InputLabel>
            <Select
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              label="Subject"
              required
            >
              {ALL_SUBJECTS.map((subject) => (
                <MenuItem key={subject} value={subject}>
                  {subject}
                </MenuItem>
              ))}
            </Select>
            {errors.subject && <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>{errors.subject}</Typography>}
          </FormControl>
          
          <TextField
            fullWidth
            label="Google Drive URL"
            name="resourceUrl"
            value={formData.resourceUrl}
            onChange={handleInputChange}
            error={!!errors.resourceUrl}
            helperText={errors.resourceUrl || 'Please provide a Google Drive link to the resource'}
            placeholder="https://drive.google.com/..."
            required
          />
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
          {isSubmitting ? <CircularProgress size={20} /> : 'Add Resource'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddResourceModal;