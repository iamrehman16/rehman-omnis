import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  People,
  School,
  PersonAdd,
  AdminPanelSettings,
  Assignment,
  TrendingUp
} from '@mui/icons-material';
import userService from '../../services/user.service';

const AdminStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await userService.getAdminStats();
      if (result.success) {
        setStats(result.data);
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Error loading admin stats:', error);
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.users?.total || 0,
      icon: <People sx={{ fontSize: 40 }} />,
      color: 'primary.main',
      bgColor: 'primary.light'
    },
    {
      title: 'Students',
      value: stats?.users?.students || 0,
      icon: <School sx={{ fontSize: 40 }} />,
      color: 'info.main',
      bgColor: 'info.light'
    },
    {
      title: 'Contributors',
      value: stats?.users?.contributors || 0,
      icon: <PersonAdd sx={{ fontSize: 40 }} />,
      color: 'success.main',
      bgColor: 'success.light'
    },
    {
      title: 'Admins',
      value: stats?.users?.admins || 0,
      icon: <AdminPanelSettings sx={{ fontSize: 40 }} />,
      color: 'error.main',
      bgColor: 'error.light'
    },
    {
      title: 'Pending Requests',
      value: stats?.users?.pending || 0,
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      color: 'warning.main',
      bgColor: 'warning.light'
    },
    {
      title: 'Total Resources',
      value: stats?.resources || 0,
      icon: <Assignment sx={{ fontSize: 40 }} />,
      color: 'secondary.main',
      bgColor: 'secondary.light'
    }
  ];

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        System Overview
      </Typography>

      <Grid container spacing={3}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: card.bgColor,
                      color: card.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {card.icon}
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', color: card.color }}>
                      {card.value}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {card.title}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Additional Stats */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Quick Insights
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  User Distribution
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Students:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {stats?.users?.total > 0 
                        ? Math.round((stats.users.students / stats.users.total) * 100)
                        : 0}%
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Contributors:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {stats?.users?.total > 0 
                        ? Math.round((stats.users.contributors / stats.users.total) * 100)
                        : 0}%
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Admins:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {stats?.users?.total > 0 
                        ? Math.round((stats.users.admins / stats.users.total) * 100)
                        : 0}%
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  System Health
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Resources per User:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {stats?.users?.total > 0 
                        ? Math.round(stats.resources / stats.users.total * 10) / 10
                        : 0}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Pending Requests:</Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 600,
                        color: stats?.users?.pending > 0 ? 'warning.main' : 'success.main'
                      }}
                    >
                      {stats?.users?.pending || 0}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">System Status:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                      Operational
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AdminStats;