import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Chip,
  Paper,
  Alert,
  CircularProgress,
  Snackbar
} from '@mui/material';
import { Add, ExpandMore, School, MenuBook } from '@mui/icons-material';
import AddResourceModal from '../resources/AddResourceModal';
import EditResourceModal from '../resources/EditResourceModal';
import DeleteConfirmationDialog from '../resources/DeleteConfirmationDialog';
import ResourceCard from '../resources/ResourceCard';
import resourcesService from '../../services/resources.service';
import { useAuth } from '../../context/AuthContext';
import RoleBasedAccess from '../common/RoleBasedAccess';
import { SEMESTER_STRUCTURE, RESOURCE_TYPES } from '../../utils/dataStructures';

const ResourcesPage = () => {
  const { user, canAddContent } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [resources, setResources] = useState([]);
  const [expandedSemester, setExpandedSemester] = useState(false);
  const [expandedSubject, setExpandedSubject] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Load resources from Firebase
  useEffect(() => {
    // Debug: Check environment variables
    console.log('Environment variables check:');
    console.log('API Key:', import.meta.env.VITE_FIREBASE_API_KEY ? 'Set' : 'Missing');
    console.log('Project ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID);
    console.log('Auth Domain:', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN);
    
    loadResources();
  }, []);

  const loadResources = async () => {
    setLoading(true);
    try {
      const result = await resourcesService.getResources();
      if (result.success) {
        setResources(result.data);
      } else {
        showSnackbar('Failed to load resources', 'error');
      }
    } catch (error) {
      console.error('Error loading resources:', error);
      showSnackbar('Error loading resources', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddResource = async (newResource) => {
    if (!user) {
      showSnackbar('You must be logged in to add resources', 'error');
      return;
    }

    try {
      const result = await resourcesService.addResource(newResource, user.uid, user.displayName);
      if (result.success) {
        showSnackbar('Resource added successfully!', 'success');
        // Reload resources to get the latest data
        await loadResources();
      } else {
        showSnackbar(result.message || 'Failed to add resource', 'error');
      }
    } catch (error) {
      console.error('Error adding resource:', error);
      showSnackbar('Error adding resource', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getResourcesForSubject = (semester, subject, type) => {
    return resources.filter(resource => 
      resource.semester === semester && 
      resource.subject === subject && 
      resource.type === type
    );
  };

  const handleSemesterChange = (semester) => (_, isExpanded) => {
    setExpandedSemester(isExpanded ? semester : false);
    setExpandedSubject(false); // Close subject when semester changes
  };

  const handleSubjectChange = (subjectKey) => (_, isExpanded) => {
    setExpandedSubject(isExpanded ? subjectKey : false);
  };

  const handleEditResource = (resource) => {
    setSelectedResource(resource);
    setEditModalOpen(true);
  };

  const handleDeleteResource = (resource) => {
    setSelectedResource(resource);
    setDeleteDialogOpen(true);
  };

  const handleUpdateResource = async (resourceId, updateData) => {
    try {
      const result = await resourcesService.updateResource(resourceId, updateData);
      if (result.success) {
        showSnackbar('Resource updated successfully!', 'success');
        await loadResources(); // Reload resources
      } else {
        showSnackbar(result.message || 'Failed to update resource', 'error');
      }
    } catch (error) {
      console.error('Error updating resource:', error);
      showSnackbar('Error updating resource', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedResource) return;
    
    setIsDeleting(true);
    try {
      const result = await resourcesService.deleteResource(selectedResource.id);
      if (result.success) {
        showSnackbar('Resource deleted successfully!', 'success');
        await loadResources(); // Reload resources
        setDeleteDialogOpen(false);
        setSelectedResource(null);
      } else {
        showSnackbar(result.message || 'Failed to delete resource', 'error');
      }
    } catch (error) {
      console.error('Error deleting resource:', error);
      showSnackbar('Error deleting resource', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 4 }, px: { xs: 1, sm: 3 } }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' }, 
        mb: { xs: 3, sm: 4 },
        gap: { xs: 2, sm: 0 }
      }}>
        <Box>
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold',
              fontSize: { xs: '1.8rem', sm: '2.125rem' }
            }}
          >
            Resources
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
          >
            Browse academic resources organized by semester and subject
          </Typography>
        </Box>
        <RoleBasedAccess requirePermission="canAddContent">
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setModalOpen(true)}
            sx={{ 
              minWidth: { xs: '100%', sm: 140 },
              alignSelf: { xs: 'stretch', sm: 'auto' }
            }}
          >
            Add Resource
          </Button>
        </RoleBasedAccess>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : resources.length === 0 ? (
        <RoleBasedAccess allowedRoles={['admin', 'contributor']}>
          <Alert severity="info" sx={{ mb: 4 }}>
            No resources available yet. Click the "Add Resource" button to add your first resource!
          </Alert>
        </RoleBasedAccess>
      ) : null}

      {/* Semester Accordions */}
      {!loading && Object.entries(SEMESTER_STRUCTURE).map(([semester, subjects]) => (
        <Accordion
          key={semester}
          expanded={expandedSemester === parseInt(semester)}
          onChange={handleSemesterChange(parseInt(semester))}
          sx={{ mb: 2 }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: { xs: 1, sm: 2 },
              flexWrap: 'wrap'
            }}>
              <School color="primary" sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600,
                  fontSize: { xs: '1rem', sm: '1.25rem' }
                }}
              >
                Semester {semester}
              </Typography>
              <Chip 
                label={`${subjects.length} subjects`} 
                size="small" 
                variant="outlined"
                sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}
              />
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {/* Subject Accordions */}
            {subjects.map((subject) => {
              const subjectKey = `${semester}-${subject}`;
              const subjectResourceCount = resources.filter(r => 
                r.semester === parseInt(semester) && r.subject === subject
              ).length;

              return (
                <Accordion
                  key={subjectKey}
                  expanded={expandedSubject === subjectKey}
                  onChange={handleSubjectChange(subjectKey)}
                  sx={{ mb: 1, ml: 2 }}
                >
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: { xs: 1, sm: 2 },
                      flexWrap: 'wrap'
                    }}>
                      <MenuBook 
                        color="secondary" 
                        sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}
                      />
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          fontWeight: 500,
                          fontSize: { xs: '0.9rem', sm: '1rem' }
                        }}
                      >
                        {subject}
                      </Typography>
                      {subjectResourceCount > 0 && (
                        <Chip 
                          label={`${subjectResourceCount} resources`} 
                          size="small" 
                          color="primary"
                          variant="outlined"
                          sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
                        />
                      )}
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    {/* Resource Types */}
                    {RESOURCE_TYPES.map((type) => {
                      const typeResources = getResourcesForSubject(parseInt(semester), subject, type);
                      
                      if (typeResources.length === 0) return null;

                      return (
                        <Box key={type} sx={{ mb: 3 }}>
                          <Typography 
                            variant="subtitle2" 
                            sx={{ 
                              mb: 2, 
                              fontWeight: 600, 
                              color: 'primary.main',
                              fontSize: { xs: '0.8rem', sm: '0.875rem' }
                            }}
                          >
                            {type} ({typeResources.length})
                          </Typography>
                          <Grid container spacing={{ xs: 1, sm: 2 }}>
                            {typeResources.map((resource) => (
                              <Grid item xs={12} sm={6} md={4} lg={3} key={resource.id}>
                                <ResourceCard 
                                  resource={resource} 
                                  currentUser={user}
                                  onEdit={handleEditResource}
                                  onDelete={handleDeleteResource}
                                />
                              </Grid>
                            ))}
                          </Grid>
                        </Box>
                      );
                    })}
                    
                    {/* Show message if no resources for this subject */}
                    {resources.filter(r => r.semester === parseInt(semester) && r.subject === subject).length === 0 && (
                      <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.50' }}>
                        <Typography variant="body2" color="text.secondary">
                          No resources available for {subject} in Semester {semester}
                        </Typography>
                      </Paper>
                    )}
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </AccordionDetails>
        </Accordion>
      ))}

      {/* Add Resource Modal */}
      <AddResourceModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddResource}
      />

      {/* Edit Resource Modal */}
      <EditResourceModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedResource(null);
        }}
        onSubmit={handleUpdateResource}
        resource={selectedResource}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSelectedResource(null);
        }}
        onConfirm={handleConfirmDelete}
        resource={selectedResource}
        isDeleting={isDeleting}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </Container>
  );
};

export default ResourcesPage;