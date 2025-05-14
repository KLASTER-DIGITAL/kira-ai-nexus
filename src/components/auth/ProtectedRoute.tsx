import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'superadmin';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { isAuthenticated, isLoading, profile } = useAuth();
  const location = useLocation();

  // If still loading auth state, show loading indicator
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="w-20 h-20 bg-kira-purple rounded-xl flex items-center justify-center mb-4">
          <span className="text-4xl font-bold text-white">K</span>
        </div>
        <Loader2 className="h-8 w-8 animate-spin text-kira-purple mb-4" />
        <h2 className="text-xl font-medium text-white">Загрузка...</h2>
        <p className="text-slate-400">Пожалуйста, подождите</p>
      </div>
    );
  }

  // If not authenticated, redirect to auth page
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If role is required and user doesn't have it, redirect to appropriate dashboard
  if (requiredRole && profile && profile.role !== requiredRole) {
    if (requiredRole === 'superadmin' && profile.role === 'user') {
      return <Navigate to="/dashboard/user" replace />;
    }
    
    if (requiredRole === 'user' && profile.role === 'superadmin') {
      // Admins can always access user routes, so this branch isn't actually needed,
      // but we'll keep it for clarity and potential future changes
      return <Navigate to="/dashboard/admin" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
