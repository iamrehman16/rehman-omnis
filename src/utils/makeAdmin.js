// Utility script to make a user admin using environment variable
// Run this in browser console or create a temporary button to execute

import userService from '../services/user.service';

// Function to make the configured admin user an admin
export const initializeAdmin = async () => {
  try {
    const result = await userService.initializeAdmin();
    
    if (result.success) {
      console.log('Admin initialized successfully');
      alert('Admin user initialized successfully!');
    } else {
      console.error('Failed to initialize admin:', result.message);
      alert('Failed to initialize admin: ' + result.message);
    }
  } catch (error) {
    console.error('Error initializing admin:', error);
    alert('Error initializing admin: ' + error.message);
  }
};

// Function to make a user admin by email (manual override)
export const makeUserAdmin = async (userEmail) => {
  try {
    // First, search for the user by email
    const users = await userService.searchUsers('');
    const user = users.data?.find(u => u.email === userEmail);
    
    if (!user) {
      console.error('User not found with email:', userEmail);
      alert('User not found with email: ' + userEmail);
      return;
    }
    
    // Update their role to admin
    const result = await userService.updateUserRole(user.id, 'admin');
    
    if (result.success) {
      console.log('Successfully made user admin:', userEmail);
      alert('Successfully made user admin: ' + userEmail);
    } else {
      console.error('Failed to make user admin:', result.message);
      alert('Failed to make user admin: ' + result.message);
    }
  } catch (error) {
    console.error('Error making user admin:', error);
    alert('Error making user admin: ' + error.message);
  }
};

// Auto-initialize admin on import (if needed)
// Uncomment the line below to automatically run when this file is imported
// initializeAdmin();

export default { initializeAdmin, makeUserAdmin };