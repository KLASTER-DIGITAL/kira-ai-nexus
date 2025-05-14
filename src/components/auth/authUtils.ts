
import { Location } from 'react-router-dom';
import { UserProfile } from '@/types/auth';

/**
 * Determines the appropriate redirect path based on user role and current location
 */
export const getRedirectPath = (
  profile: UserProfile | null, 
  location: Location,
  isAuthenticated: boolean
): string | null => {
  console.log("getRedirectPath check:", { profile, location, isAuthenticated });
  
  // If not authenticated, redirect to auth page
  if (!isAuthenticated) {
    return '/auth';
  }

  // If user is superadmin but trying to access user dashboard, redirect to admin dashboard
  if (profile?.role === 'superadmin' && location.pathname === '/dashboard/user') {
    console.log("Redirecting superadmin from user dashboard to admin dashboard");
    return '/dashboard/admin';
  }

  // If user is not superadmin but trying to access admin dashboard, redirect to user dashboard
  if (profile?.role !== 'superadmin' && location.pathname.includes('/dashboard/admin')) {
    console.log("Redirecting non-admin user from admin dashboard to user dashboard");
    return '/dashboard/user';
  }

  // No redirect needed
  return null;
};
