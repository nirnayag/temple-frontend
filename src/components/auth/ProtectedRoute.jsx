import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import authService from '../../services/auth';

// Route that requires user to be authenticated
export const ProtectedRoute = () => {
  const isAuthenticated = authService.isLoggedIn();
  
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

// Route that requires user to be an admin
export const AdminRoute = () => {
  const isAuthenticated = authService.isLoggedIn();
  const isAdmin = authService.isAdmin();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return isAdmin ? <Outlet /> : <Navigate to="/dashboard" />;
};

// Route that should only be accessible to non-authenticated users
export const PublicRoute = () => {
  const isAuthenticated = authService.isLoggedIn();
  
  return isAuthenticated ? <Navigate to="/dashboard" /> : <Outlet />;
}; 