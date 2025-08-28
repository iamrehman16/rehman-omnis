// src/contexts/AuthContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import authService from '../services/auth.service';
import userService from '../services/user.service';

// Auth States
const AUTH_STATES = {
  LOADING: 'loading',
  AUTHENTICATED: 'authenticated',
  UNAUTHENTICATED: 'unauthenticated'
};

// Initial state
const initialState = {
  user: null,
  status: AUTH_STATES.LOADING,
  error: null,
  isLoading: false
};

// Action types
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_USER: 'SET_USER',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  LOGOUT_SUCCESS: 'LOGOUT_SUCCESS'
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
        error: null
      };

    case AUTH_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload,
        status: action.payload ? AUTH_STATES.AUTHENTICATED : AUTH_STATES.UNAUTHENTICATED,
        isLoading: false,
        error: null
      };

    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case AUTH_ACTIONS.LOGOUT_SUCCESS:
      return {
        ...initialState,
        status: AUTH_STATES.UNAUTHENTICATED
      };

    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange(async (user) => {
      if (user) {
        // Create or update user profile in Firestore
        await userService.createOrUpdateUserProfile(user);
        
        // Fetch full user profile with role information
        const profileResult = await userService.getUserProfile(user.uid);
        if (profileResult.success) {
          // Merge Firebase Auth user with Firestore profile data
          const fullUser = {
            ...user,
            ...profileResult.data
          };
          dispatch({ type: AUTH_ACTIONS.SET_USER, payload: fullUser });
        } else {
          dispatch({ type: AUTH_ACTIONS.SET_USER, payload: user });
        }
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_USER, payload: null });
      }
    });

    return () => unsubscribe();
  }, []);

  // Actions
  const login = async (email, password) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

    const result = await authService.login(email, password);

    if (!result.success) {
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: result.message });
    }

    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    return result;
  };

  const register = async (email, password, displayName) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

    const result = await authService.register(email, password, displayName);

    if (!result.success) {
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: result.message });
    }

    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    return result;
  };

  const signInWithGoogle = async () => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

    const result = await authService.signInWithGoogle();

    if (!result.success) {
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: result.message });
    }

    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    return result;
  };

  const logout = async () => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

    const result = await authService.logout();
    
    if (result.success) {
      dispatch({ type: AUTH_ACTIONS.LOGOUT_SUCCESS });
    } else {
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: result.message });
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }

    return result;
  };

  const resetPassword = async (email) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

    const result = await authService.resetPassword(email);

    if (!result.success) {
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: result.message });
    }

    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    return result;
  };

  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Helper functions
  const isAuthenticated = state.status === AUTH_STATES.AUTHENTICATED;
  const isLoading = state.status === AUTH_STATES.LOADING || state.isLoading;
  
  // Role-based helper functions
  const getUserRole = () => state.user?.role || 'student';
  const isAdmin = () => getUserRole() === 'admin';
  const isContributor = () => getUserRole() === 'contributor';
  const isStudent = () => getUserRole() === 'student';
  const isPendingContributor = () => getUserRole() === 'pending_contributor';
  const isRejectedContributor = () => getUserRole() === 'rejected_contributor';
  
  // Permission helpers
  const canAccessAdminPages = () => isAdmin();
  const canEditContent = () => isAdmin() || isContributor();
  const canDeleteContent = () => isAdmin() || isContributor();
  const canAddContent = () => isAdmin() || isContributor();
  const canViewAdminPanel = () => isAdmin();
  const canManageUsers = () => isAdmin();
  const canApproveContributors = () => isAdmin();

  const value = {
    // State
    user: state.user,
    error: state.error,
    isAuthenticated,
    isLoading,
    
    // Role helpers
    getUserRole,
    isAdmin,
    isContributor,
    isStudent,
    isPendingContributor,
    isRejectedContributor,
    
    // Permission helpers
    canAccessAdminPages,
    canEditContent,
    canDeleteContent,
    canAddContent,
    canViewAdminPanel,
    canManageUsers,
    canApproveContributors,
    
    // Actions
    login,
    register,
    signInWithGoogle,
    logout,
    resetPassword,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AUTH_STATES };