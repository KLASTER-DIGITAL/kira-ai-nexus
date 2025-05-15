
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import { LoadingScreen } from '@/components/features/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'superadmin';
}

/**
 * ProtectedRoute component that handles authentication and role-based access
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { isAuthenticated, isLoading, profile } = useAuth();
  const location = useLocation();

  // Show loading screen while auth state is being determined
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Redirect to auth page if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  // Special case: Allow superadmins to access AI Settings without redirection
  if (profile?.role === 'superadmin' && location.pathname === '/ai-settings') {
    return <>{children}</>;
  }
  
  // Role-based access check (if a specific role is required)
  if (requiredRole && profile?.role !== requiredRole) {
    const fallbackPath = profile?.role === 'superadmin' ? '/dashboard/admin' : '/dashboard/user';
    return <Navigate to={fallbackPath} replace />;
  }

  // Default authorization - allow access
  return <>{children}</>;
};

export default ProtectedRoute;
