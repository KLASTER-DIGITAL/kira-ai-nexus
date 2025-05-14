
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import LoadingScreen from './LoadingScreen';

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
  const { isAuthenticated, isLoading, profile, isSuperAdmin } = useAuth();
  const location = useLocation();
  
  console.log('Protected Route Check:', { 
    isAuthenticated, 
    isLoading, 
    profile,
    userRole: profile?.role,
    requiredRole,
    isSuperAdmin: isSuperAdmin?.(),
    path: location.pathname
  });

  useEffect(() => {
    console.log('ProtectedRoute effect triggered:', {
      isAuthenticated,
      isLoading,
      userRole: profile?.role,
      path: location.pathname
    });
  }, [isAuthenticated, isLoading, profile, location.pathname]);

  // If still loading auth state, show loading indicator
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check dashboard routes specifically
  if (location.pathname === '/dashboard/admin' && !isSuperAdmin?.()) {
    console.log('Regular user tried to access admin dashboard - redirecting to user dashboard');
    return <Navigate to="/dashboard/user" replace />;
  }
  
  if (location.pathname === '/dashboard/user' && isSuperAdmin?.()) {
    console.log('Superadmin tried to access user dashboard - redirecting to admin dashboard');
    return <Navigate to="/dashboard/admin" replace />;
  }
  
  // For role-specific routes with explicit requiredRole prop
  if (requiredRole && profile?.role !== requiredRole) {
    console.log(`Access denied: User role ${profile?.role} does not match required role ${requiredRole}`);
    const fallbackPath = isSuperAdmin?.() ? '/dashboard/admin' : '/dashboard/user';
    return <Navigate to={fallbackPath} replace />;
  }

  // User is authenticated and has proper role, render children
  return <>{children}</>;
};

export default ProtectedRoute;
