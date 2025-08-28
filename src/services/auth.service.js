// src/services/auth.service.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../config/firebase.config';

class AuthService {
  constructor() {
    this.auth = auth;
    this.googleProvider = new GoogleAuthProvider();
  }

  // Register with email and password
  async register(email, password, displayName) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      
      // Update profile with display name
      await updateProfile(userCredential.user, {
        displayName: displayName
      });

      return {
        success: true,
        user: userCredential.user,
        message: 'Account created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.code,
        message: this.getErrorMessage(error.code)
      };
    }
  }

  // Login with email and password
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return {
        success: true,
        user: userCredential.user,
        message: 'Logged in successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.code,
        message: this.getErrorMessage(error.code)
      };
    }
  }

  // Google Sign In
  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(this.auth, this.googleProvider);
      return {
        success: true,
        user: result.user,
        message: 'Logged in with Google successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.code,
        message: this.getErrorMessage(error.code)
      };
    }
  }

  // Logout
  async logout() {
    try {
      await signOut(this.auth);
      return {
        success: true,
        message: 'Logged out successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.code,
        message: 'Error logging out'
      };
    }
  }

  // Reset Password
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(this.auth, email);
      return {
        success: true,
        message: 'Password reset email sent'
      };
    } catch (error) {
      return {
        success: false,
        error: error.code,
        message: this.getErrorMessage(error.code)
      };
    }
  }

  // Get current user
  getCurrentUser() {
    return this.auth.currentUser;
  }

  // Auth state listener
  onAuthStateChange(callback) {
    return onAuthStateChanged(this.auth, callback);
  }

  // Error message mapping
  getErrorMessage(errorCode) {
    const errorMessages = {
      'auth/user-not-found': 'No account found with this email address',
      'auth/wrong-password': 'Incorrect password',
      'auth/email-already-in-use': 'Email address is already registered',
      'auth/weak-password': 'Password should be at least 6 characters',
      'auth/invalid-email': 'Please enter a valid email address',
      'auth/user-disabled': 'This account has been disabled',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later',
      'auth/network-request-failed': 'Network error. Please check your connection',
      'auth/popup-closed-by-user': 'Sign in was cancelled',
      'auth/cancelled-popup-request': 'Sign in was cancelled'
    };
    
    return errorMessages[errorCode] || 'An unexpected error occurred';
  }
}

// Export singleton instance
export default new AuthService();