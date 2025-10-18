import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService.js';

/**
 * Private Route Component
 * Protects routes from unauthorized access
 */
export const PrivateRoute = ({ children, requireTeacher = false }) => {
  const isAuthenticated = authService.isAuthenticated();
  const isTeacher = authService.isTeacher();

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Requires teacher but user is student - redirect to users page
  if (requireTeacher && !isTeacher) {
    return <Navigate to="/users" replace />;
  }

  // Authorized - render children
  return children;
};
