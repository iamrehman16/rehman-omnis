import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Avatar,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  School,
  Description,
  Assignment,
  MenuBook,
  TipsAndUpdates,
  Quiz,
  CalendarToday
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import userService from '../../services/user.service';
import resourcesService from '../../services/resources.service';

const ProfilePage = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [userResources, setUserResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      // Load user profile
      const profileResult = await userService.getUserProfile(user.uid);
      if (profileResult.success) {
        setUserProfile(profileResult.data);
      }

      // Load user statistics
      const statsResult = await userService.getUserStats(user.uid);
      if (statsResult.success) {
        setUserStats(statsResult.data);
      }

      // Load user's resources
      const resourcesResult = await resourcesService.getUserResources(user.uid);
      if (resourcesResult.success) {
        setUserResources(resourcesResult.data);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getResourceIcon = (type) => {
    switch (type) {
      case 'Past Paper': return <Quiz />;
      case 'Notes': return <Description />;
      case 'Assignment': return <Assignment />;
      case 'Reference Material': return <MenuBook />;
      case 'Tips and Suggestions': return <TipsAndUpdates />;
      default: return <Description />;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">You must be logged in to view your profile.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Profile Header */}
      <Paper elevation={1} sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Avatar
            src={user.photoURL}
            sx={{ width: 80, height: 80, fontSize: '2rem' }}
          >
            {user.displayName?.[0] || user.email?.[0]}
          </Avatar>
          <Box>
            <Typography variant="h4" gutterBottom>
              {user.displayName || 'User'}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {user.email}
            </Typography>
            {userProfile?.createdAt && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarToday fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  Joined {userProfile.createdAt.toLocaleDateString()}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <School color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="primary">
                {userStats?.totalResources || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Resources Shared
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Resources by Type
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {userStats?.resourcesByType && Object.entries(userStats.resourcesByType).map(([type, count]) => (
                  <Chip
                    key={type}
                    icon={getResourceIcon(type)}
                    label={`${type}: ${count}`}
                    variant="outlined"
                    size="small"
                  />
                ))}
                {(!userStats?.resourcesByType || Object.keys(userStats.resourcesByType).length === 0) && (
                  <Typography variant="body2" color="text.secondary">
                    No resources shared yet
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Resources */}
      <Paper elevation={1} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Your Recent Resources
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        {userResources.length > 0 ? (
          <Grid container spacing={2}>
            {userResources.slice(0, 6).map((resource) => (
              <Grid item xs={12} sm={6} md={4} key={resource.id}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      {getResourceIcon(resource.type)}
                      <Typography variant="subtitle2" noWrap>
                        {resource.name}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {resource.subject} - Semester {resource.semester}
                    </Typography>
                    <Chip label={resource.type} size="small" variant="outlined" />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Alert severity="info">
            You haven't shared any resources yet. Start by adding your first resource!
          </Alert>
        )}
      </Paper>
    </Container>
  );
};

export default ProfilePage;