
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth';

const HelpPage: React.FC = () => {
  const { profile, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && profile) {
      // Redirect based on user role
      if (profile.role === 'superadmin') {
        navigate('/help/admin', { replace: true });
      } else {
        navigate('/help/user', { replace: true });
      }
    }
  }, [isAuthenticated, profile, navigate]);

  return <div>Перенаправление...</div>;
};

export default HelpPage;
