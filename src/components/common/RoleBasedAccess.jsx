import React from 'react';
import { useAuth } from '../../context/AuthContext';

/**
 * Component for role-based access control
 * 
 * Usage examples:
 * <RoleBasedAccess allowedRoles={['admin']}>Admin only content</RoleBasedAccess>
 * <RoleBasedAccess allowedRoles={['admin', 'contributor']}>Admin and contributor content</RoleBasedAccess>
 * <RoleBasedAccess requirePermission="canEditContent">Content for users who can edit</RoleBasedAccess>
 * <RoleBasedAccess hideFor={['student']}>Hide from students</RoleBasedAccess>
 */
const RoleBasedAccess = ({ 
  children, 
  allowedRoles = [], 
  hideFor = [], 
  requirePermission = null,
  fallback = null 
}) => {
  const { getUserRole, ...permissions } = useAuth();
  
  const userRole = getUserRole();
  
  // Check if user role is in hideFor array
  if (hideFor.length > 0 && hideFor.includes(userRole)) {
    return fallback;
  }
  
  // Check if user has required permission
  if (requirePermission && permissions[requirePermission]) {
    if (typeof permissions[requirePermission] === 'function' && !permissions[requirePermission]()) {
      return fallback;
    } else if (typeof permissions[requirePermission] === 'boolean' && !permissions[requirePermission]) {
      return fallback;
    }
  }
  
  // Check if user role is in allowedRoles array
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return fallback;
  }
  
  return children;
};

export default RoleBasedAccess;