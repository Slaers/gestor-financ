import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUserStore } from '../store/userStore';

const ProtectedRoute: React.FC = () => {
  // const { token } = useUserStore.getState(); // Good for initial check
  // For dynamic updates if token changes while app is open, subscribe to store:
  const token = useUserStore((state) => state.token);


  if (!token) {
    // User not authenticated, redirect to login page
    return <Navigate to="/login" replace />;
  }

  // User is authenticated, render the child route content
  return <Outlet />;
};

export default ProtectedRoute;
