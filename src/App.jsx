// src/App.js
import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import ProtectedRoute from './components/common/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import LandingPage from './components/pages/LandingPage';

const theme = createTheme();

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return isLogin ? (
    <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
  ) : (
    <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
  );
}

function App() {
  // Check if user has visited before or is already authenticated
  const [showLanding, setShowLanding] = useState(() => {
    const hasVisited = localStorage.getItem('omnis-has-visited');
    const hasAuthToken = localStorage.getItem('omnis-auth-token') || sessionStorage.getItem('omnis-auth-token');
    
    // If user has visited before or has auth token, skip landing page
    return !hasVisited && !hasAuthToken;
  });

  const handleGetStarted = () => {
    // Mark that user has visited the app
    localStorage.setItem('omnis-has-visited', 'true');
    setShowLanding(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {showLanding ? (
        <LandingPage onGetStarted={handleGetStarted} />
      ) : (
        <AuthProvider>
          <ChatProvider>
            <ProtectedRoute fallback={<AuthPage />}>
              <MainLayout />
            </ProtectedRoute>
          </ChatProvider>
        </AuthProvider>
      )}
    </ThemeProvider>
  );
}

export default App;
