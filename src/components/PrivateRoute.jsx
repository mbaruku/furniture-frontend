import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  // Angalia kama admin ame-login (token au context)
  const isAuthenticated = localStorage.getItem('adminToken'); 

  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

export default PrivateRoute;
