import React, { useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import Header from './Header';
import ResourcesPage from '../pages/ResourcesPage';
import AskPage from '../pages/AskPage';
import ProfilePage from '../pages/ProfilePage';
import AdminPage from '../pages/AdminPage';
import FloatingChat from '../common/FloatingChat';
import RoleBasedAccess from '../common/RoleBasedAccess';

const MainLayout = () => {
  const { canAccessAdminPages, getUserRole, isAdmin } = useAuth();
  const [currentTab, setCurrentTab] = useState('resources');

const handleTabChange = (event, newValue) => {
  console.log('Tab change requested:', newValue);
  console.log('User role:', getUserRole());
  console.log('Is admin:', isAdmin());

  // Always allow switching tabs, RoleBasedAccess will enforce access
  setCurrentTab(newValue);
};


  const handleProfileClick = () => {
    setCurrentTab('profile');
  };

  // Access denied component
  const AccessDenied = () => (
    <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
      <Paper sx={{ p: 4, textAlign: 'center', maxWidth: 400 }}>
        <Typography variant="h5" color="error" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1" color="text.secondary">
          You don't have permission to access this page.
        </Typography>
      </Paper>
    </Box>
  );

  const renderCurrentPage = () => {
    switch (currentTab) {
      case 'resources':
        return <ResourcesPage />;
      case 'ask':
        return <AskPage />;
      case 'profile':
        return <ProfilePage />;
      case 'admin':
        return (
         <RoleBasedAccess allowedRoles={['admin']} fallback={<AccessDenied />}>
            <AdminPage />
          </RoleBasedAccess>

        );
      default:
        return <ResourcesPage />;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Header 
        currentTab={currentTab} 
        onTabChange={handleTabChange} 
        onProfileClick={handleProfileClick}
      />
      <Box component="main">
        {renderCurrentPage()}
      </Box>
      
      {/* Global Floating Chat */}
      <FloatingChat />
    </Box>
  );
};

export default MainLayout;