import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * SECURITY CHECK: Protected Routes
 * Wraps routes that require authentication and specific roles.
 */
const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    // Not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Logged in but doesn't have the right role, redirect to unauthorized or home
    return <Navigate to="/unauthorized" replace />;
  }

  // Authorized, return child routes
  return <Outlet />;
};

export default ProtectedRoute;
