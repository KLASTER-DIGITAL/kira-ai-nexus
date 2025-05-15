
import { UserProfile } from '@/types/auth';
import { supabase } from "@/integrations/supabase/client";
import { Location } from 'react-router-dom';

/**
 * Cleans up all authentication-related data from browser storage
 */
export const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  
  // Clean localStorage items
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  
  // Clean sessionStorage items if available
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

/**
 * Fetches a user's profile data from Supabase
 */
export const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    console.log("Fetching profile for userId:", userId);
    
    // First attempt to get the profile
    let { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId);

    if (error) {
      console.error('Error fetching user profile:', error.message);
      return null;
    }
    
    // If we got multiple rows, take the first one
    if (Array.isArray(data) && data.length > 0) {
      console.log("Profile data received (array):", data[0]);
      return data[0] as unknown as UserProfile;
    } else if (data) {
      console.log("Profile data received (single):", data);
      return data as unknown as UserProfile;
    }
    
    console.log("No profile found for user:", userId);
    return null;
  } catch (error) {
    console.error('Exception when fetching user profile:', error);
    return null;
  }
};

/**
 * Determines if the current user has superadmin permissions
 */
export const isSuperAdmin = (profile: UserProfile | null): boolean => {
  return profile?.role === 'superadmin';
};

/**
 * Determines the appropriate redirect path based on user role
 * @param profile User profile data
 * @param location Current location from react-router
 * @param isAuthenticated Authentication state flag
 * @returns Redirect path or null if no redirection needed
 */
export const getRedirectPath = (
  profile: UserProfile | null, 
  location: Location,
  isAuthenticated: boolean
): string | null => {
  // If user is not authenticated and not on auth or reset password page, redirect to auth
  if (!isAuthenticated) {
    if (location.pathname !== '/auth' && location.pathname !== '/reset-password' && location.pathname !== '/') {
      return '/auth';
    }
    return null; // Don't redirect if already on auth page, reset password page or home page
  }

  // Handle authenticated user redirections

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

  return null; // No redirection needed
};
