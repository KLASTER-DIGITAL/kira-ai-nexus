
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import { LoadingScreen } from '@/components/features/auth';
import { getRedirectPath } from '@/context/auth/utils';

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
    console.log("Auth is loading, showing LoadingScreen");
    return <LoadingScreen />;
  }

  // Check for redirection based on auth state and role
  const redirectPath = getRedirectPath(profile, location, isAuthenticated);
  
  if (redirectPath) {
    console.log(`Redirecting to ${redirectPath} from ${location.pathname}`);
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }
  
  // Role-based access check (if a specific role is required)
  if (requiredRole && profile?.role !== requiredRole) {
    const fallbackPath = profile?.role === 'superadmin' ? '/dashboard/admin' : '/dashboard/user';
    console.log(`Role check failed. Required: ${requiredRole}, User has: ${profile?.role}, redirecting to ${fallbackPath}`);
    return <Navigate to={fallbackPath} replace />;
  }

  // Default authorization - allow access
  console.log(`Access granted to ${location.pathname}`);
  return <>{children}</>;
};

export default ProtectedRoute;
