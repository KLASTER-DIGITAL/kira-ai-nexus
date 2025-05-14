
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
  // If user is not authenticated, redirect to auth page
  if (!isAuthenticated) {
    return '/auth';
  }

  // SPECIAL CASE: Never redirect superadmins from AI Settings page
  if (profile?.role === 'superadmin' && location.pathname === '/ai-settings') {
    return null;
  }

  // Redirect superadmin from user dashboard to admin dashboard
  if (profile?.role === 'superadmin' && location.pathname === '/dashboard/user') {
    return '/dashboard/admin';
  }

  // Redirect non-superadmin from admin areas
  if (profile?.role !== 'superadmin' && 
      (location.pathname.includes('/dashboard/admin') || location.pathname === '/ai-settings')) {
    return '/dashboard/user';
  }

  // No redirection needed
  return null;
};
