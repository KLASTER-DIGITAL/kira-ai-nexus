
import { UserProfile } from '@/types/auth';
import { supabase } from "@/integrations/supabase/client";

/**
 * Cleans up all authentication-related data from browser storage
 * 
 * This function should be called:
 * - Before initiating a new sign-in to prevent auth conflicts
 * - As part of the logout process to ensure complete session removal
 * - When switching between accounts
 * 
 * @example
 * // When signing out a user
 * cleanupAuthState();
 * await supabase.auth.signOut();
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
 * 
 * @param userId - The UUID of the user to fetch profile data for
 * @returns A UserProfile object if successful, null if not found or error
 * 
 * @example
 * const profile = await fetchUserProfile(session.user.id);
 * if (profile) {
 *   console.log('User role:', profile.role);
 * }
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
 * Checks if a user has superadmin role
 * 
 * @param profile - The user profile to check
 * @returns True if the user is a superadmin, false otherwise
 * 
 * @example
 * const isAdmin = isSuperAdminRole(userProfile);
 * if (isAdmin) {
 *   // Show admin controls
 * }
 */
export const isSuperAdminRole = (profile: UserProfile | null): boolean => {
  const isAdmin = profile?.role === 'superadmin';
  console.log("isSuperAdminRole check:", { role: profile?.role, isAdmin });
  return isAdmin;
};

/**
 * Determines the appropriate redirect path based on user role
 * 
 * @param profile - The user profile containing role information
 * @returns The path where the user should be redirected
 * 
 * @example
 * const path = getRedirectPath(userProfile);
 * navigate(path);
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
