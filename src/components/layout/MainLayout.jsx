import React, { useState } from 'react';
import { Box } from '@mui/material';
import Header from './Header';
import ResourcesPage from '../pages/ResourcesPage';
import AskPage from '../pages/AskPage';
import ProfilePage from '../pages/ProfilePage';

const MainLayout = () => {
  const [currentTab, setCurrentTab] = useState('resources');

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleProfileClick = () => {
    setCurrentTab('profile');
  };

  const renderCurrentPage = () => {
    switch (currentTab) {
      case 'resources':
        return <ResourcesPage />;
      case 'ask':
        return <AskPage />;
      case 'profile':
        return <ProfilePage />;
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
    </Box>
  );
};

export default MainLayout;