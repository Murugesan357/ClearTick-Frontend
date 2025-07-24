import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const authtoken = localStorage.getItem('authtoken');

  useEffect(() => {
    if (!authtoken) {
      navigate('/login');
    }
  }, [authtoken, navigate]);

  if (!authtoken) {
    return null;
  }

  return children;
};

export default ProtectedRoute;