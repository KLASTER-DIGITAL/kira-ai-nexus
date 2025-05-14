
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import LoadingScreen from './LoadingScreen';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'superadmin';
}

/**
 * ProtectedRoute component that handles authentication and role-based access
 * 
 * @param children - Child components to render when access is granted
 * @param requiredRole - Optional role requirement for accessing this route
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { isAuthenticated, isLoading, profile, isSuperAdmin } = useAuth();
  const location = useLocation();
  
  console.log('Protected Route Check:', { 
    isAuthenticated, 
    isLoading, 
    profile,
    userRole: profile?.role,
    requiredRole,
    isSuperAdmin: isSuperAdmin(),
    path: location.pathname
  });

  // If still loading auth state, show loading indicator
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  // For superadmin trying to access user dashboard, redirect to admin dashboard
  if (isSuperAdmin() && location.pathname === '/dashboard/user') {
    console.log('Superadmin redirected from user dashboard to admin dashboard');
    return <Navigate to="/dashboard/admin" replace />;
  }
  
  // For role-specific routes, check if user has required role
  if (requiredRole && profile?.role !== requiredRole) {
    console.log(`Access denied: User role ${profile?.role} does not match required role ${requiredRole}`);
    const fallbackPath = isSuperAdmin() ? '/dashboard/admin' : '/dashboard/user';
    return <Navigate to={fallbackPath} replace />;
  }

  // User is authenticated and has proper role, render children
  return <>{children}</>;
};

export default ProtectedRoute;
