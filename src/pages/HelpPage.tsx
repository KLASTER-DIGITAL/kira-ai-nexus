
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import { Loader2 } from 'lucide-react';

const HelpPage: React.FC = () => {
  const { profile, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState('Загрузка справочных материалов...');
  const [docsLastSync, setDocsLastSync] = useState<string | null>(null);
  const [docsLastDeploy, setDocsLastDeploy] = useState<string | null>(null);

  useEffect(() => {
    // Check last docs sync time from localStorage
    const lastSync = localStorage.getItem('docsLastSync');
    if (lastSync) {
      const syncDate = new Date(parseInt(lastSync));
      setDocsLastSync(syncDate.toLocaleString());
    }
    
    // Check last docs deployment time from localStorage
    const lastDeploy = localStorage.getItem('docsLastDeploy');
    if (lastDeploy) {
      const deployDate = new Date(parseInt(lastDeploy));
      setDocsLastDeploy(deployDate.toLocaleString());
    }

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
      <div className="text-sm text-muted-foreground mt-4 text-center">
        {docsLastSync && (
          <p className="mb-1">
            Последняя синхронизация документации: {docsLastSync}
          </p>
        )}
        {docsLastDeploy && (
          <p>
            Последний деплой в Mintlify: {docsLastDeploy}
          </p>
        )}
      </div>
    </div>
  );
};

export default HelpPage;
