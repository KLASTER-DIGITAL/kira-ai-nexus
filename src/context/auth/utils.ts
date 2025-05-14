
import { UserProfile } from '@/types/auth';
import { supabase } from "@/integrations/supabase/client";

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
      return data[0] as UserProfile;
    } else if (data) {
      console.log("Profile data received (single):", data);
      return data as UserProfile;
    }
    
    console.log("No profile found for user:", userId);
    return null;
  } catch (error) {
    console.error('Exception when fetching user profile:', error);
    return null;
  }
};

/**
 * Determines the appropriate redirect path based on user role
 */
export const getRedirectPath = (profile: UserProfile | null): string => {
  if (!profile) {
    console.log("getRedirectPath: No profile, redirecting to /auth");
    return '/auth';
  }
  
  if (profile.role === 'superadmin') {
    console.log("getRedirectPath: User is superadmin, redirecting to /dashboard/admin");
    return '/dashboard/admin';
  } else {
    console.log("getRedirectPath: User is regular user, redirecting to /dashboard/user");
    return '/dashboard/user';
  }
};
