
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
  // If not authenticated, redirect to auth page
  if (!isAuthenticated) {
    return '/auth';
  }

  // Allow direct access to AI settings for superadmins
  if (profile?.role === 'superadmin' && location.pathname === '/ai-settings') {
    return null; // No redirect needed for AI settings
  }

  // If user is superadmin but trying to access user dashboard, redirect to admin dashboard
  if (profile?.role === 'superadmin' && location.pathname === '/dashboard/user') {
    return '/dashboard/admin';
  }

  // If user is not superadmin but trying to access admin dashboard or ai-settings, redirect to user dashboard
  if (profile?.role !== 'superadmin' && 
      (location.pathname.includes('/dashboard/admin') || location.pathname === '/ai-settings')) {
    return '/dashboard/user';
  }

  // No redirect needed
  return null;
};
