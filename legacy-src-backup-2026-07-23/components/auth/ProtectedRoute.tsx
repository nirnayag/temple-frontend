import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import authService from '../../services/auth';

// Route that requires user to be an admin
export const AdminRoute: React.FC = () => {
  const isAuthenticated = authService.isLoggedIn();
  const isAdmin = authService.isAdmin();
  
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  return isAdmin ? <Outlet /> : <Navigate to="/" />;
};
