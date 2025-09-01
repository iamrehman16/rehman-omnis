import React, { useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import Header from './Header';
import Footer from './Footer';
import ResourcesPage from '../pages/ResourcesPage';
import AskPage from '../pages/AskPage';
import ProfilePage from '../pages/ProfilePage';
import AdminPage from '../pages/AdminPage';
import AboutPage from '../pages/AboutPage';
import PrivacyPage from '../pages/PrivacyPage';
import TermsPage from '../pages/TermsPage';
import HelpCenterPage from '../pages/HelpCenterPage';
import FloatingChat from '../common/FloatingChat';
import ChatbotFloating from '../common/ChatbotFloating';
import RoleBasedAccess from '../common/RoleBasedAccess';

const MainLayout = () => {
  const { canAccessAdminPages, getUserRole, isAdmin } = useAuth();
  
  // Persist current tab in localStorage
  const [currentTab, setCurrentTab] = useState(() => {
    const savedTab = localStorage.getItem('omnis-current-tab');
    return savedTab || 'resources';
  });

const handleTabChange = (event, newValue) => {
  console.log('Tab change requested:', newValue);
  console.log('User role:', getUserRole());
  console.log('Is admin:', isAdmin());

  // Always allow switching tabs, RoleBasedAccess will enforce access
  setCurrentTab(newValue);
  // Persist the current tab
  localStorage.setItem('omnis-current-tab', newValue);
};


  const handleProfileClick = () => {
    setCurrentTab('profile');
    // Persist the current tab
    localStorage.setItem('omnis-current-tab', 'profile');
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

  const handleBackToApp = () => {
    setCurrentTab('resources');
    localStorage.setItem('omnis-current-tab', 'resources');
  };

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
      case 'about':
        return <AboutPage onBack={handleBackToApp} />;
      case 'privacy':
        return <PrivacyPage onBack={handleBackToApp} />;
      case 'terms':
        return <TermsPage onBack={handleBackToApp} />;
      case 'help':
        return <HelpCenterPage onBack={handleBackToApp} />;
      default:
        return <ResourcesPage />;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', display: 'flex', flexDirection: 'column' }}>
      <Header 
        currentTab={currentTab} 
        onTabChange={handleTabChange} 
        onProfileClick={handleProfileClick}
      />
      <Box component="main" sx={{ flex: 1 }}>
        {renderCurrentPage()}
      </Box>
      
      {/* Footer */}
      <Footer onNavigate={(page) => {
        setCurrentTab(page);
        localStorage.setItem('omnis-current-tab', page);
      }} />
      
      {/* Global Floating Chat */}
      <FloatingChat />
      
      {/* AI Chatbot */}
      <ChatbotFloating />
    </Box>
  );
};

export default MainLayout;