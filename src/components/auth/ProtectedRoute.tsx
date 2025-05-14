
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import LoadingScreen from './LoadingScreen';
import { getRedirectPath } from './authUtils';

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

  // If still loading auth state, show loading indicator
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check for redirects based on role and current path
  const redirectPath = getRedirectPath(profile, location, isAuthenticated);
  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }
  
  // For role-specific routes with explicit requiredRole prop
  if (requiredRole && profile?.role !== requiredRole) {
    const fallbackPath = profile?.role === 'superadmin' ? '/dashboard/admin' : '/dashboard/user';
    return <Navigate to={fallbackPath} replace />;
  }

  // User is authenticated and has proper role, render children
  return <>{children}</>;
};

export default ProtectedRoute;
