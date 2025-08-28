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
  const [showLanding, setShowLanding] = useState(true);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {showLanding ? (
        <LandingPage onGetStarted={() => setShowLanding(false)} />
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
