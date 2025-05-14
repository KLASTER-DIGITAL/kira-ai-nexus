
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
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error.message);
      return null;
    }
    
    console.log("Profile data received:", data);
    return data as UserProfile;
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
  
  const path = profile.role === 'superadmin' ? '/dashboard/admin' : '/dashboard/user';
  console.log("getRedirectPath determined:", { role: profile?.role, path });
  return path;
};
