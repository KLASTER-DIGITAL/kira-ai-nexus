
import { UserProfile } from '@/types/auth';
import { supabase } from "@/integrations/supabase/client";

/**
 * Clean up auth state in localStorage and sessionStorage
 */
export const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

/**
 * Fetch user profile from Supabase
 */
export const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data as UserProfile;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

/**
 * Check if user has superadmin role
 */
export const isSuperAdminRole = (profile: UserProfile | null): boolean => {
  return profile?.role === 'superadmin';
};

/**
 * Handle redirect based on user role
 */
export const getRedirectPath = (profile: UserProfile | null): string => {
  if (profile?.role === 'superadmin') {
    return '/dashboard/admin';
  } else {
    return '/dashboard/user';
  }
};
