
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import { Loader2 } from 'lucide-react';

const HelpPage: React.FC = () => {
  const { profile, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState('Загрузка справочных материалов...');

  useEffect(() => {
    if (isAuthenticated && profile) {
      // Redirect based on user role
      if (profile.role === 'superadmin') {
        setMessage('Перенаправление на страницу администратора...');
        const timer = setTimeout(() => {
          navigate('/help/admin', { replace: true });
        }, 800);
        return () => clearTimeout(timer);
      } else {
        setMessage('Перенаправление на страницу пользователя...');
        const timer = setTimeout(() => {
          navigate('/help/user', { replace: true });
        }, 800);
        return () => clearTimeout(timer);
      }
    }
  }, [isAuthenticated, profile, navigate]);

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin mb-4" />
      <p className="text-lg">{message}</p>
    </div>
  );
};

export default HelpPage;
