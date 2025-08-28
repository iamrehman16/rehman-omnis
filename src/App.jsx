// src/App.js
import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import ProtectedRoute from './components/common/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';

const theme = createTheme();

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  
  return isLogin ? 
    <LoginForm onSwitchToRegister={() => setIsLogin(false)} /> :
    <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <ProtectedRoute fallback={<AuthPage />}>
          <MainLayout />
        </ProtectedRoute>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;