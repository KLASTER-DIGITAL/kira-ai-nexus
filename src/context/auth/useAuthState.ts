
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/auth';
import { toast } from '@/hooks/use-toast';

/**
 * Hook for managing authentication state
 */
export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [initialized, setInitialized] = useState<boolean>(false);

  // Get user profile from database
  const fetchProfile = async (userId: string) => {
    try {
      console.log("Fetching profile for user:", userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      
      console.log("Profile fetched successfully:", data);
      return data;
    } catch (error) {
      console.error('Exception fetching profile:', error);
      return null;
    }
  };

  // Check if the current user is a super admin
  const isSuperAdmin = () => {
    return profile?.role === 'superadmin';
  };

  // Sign in with email and password
  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  };

  // Sign up with email and password
  const signUpWithEmail = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear local state
      setUser(null);
      setSession(null);
      setProfile(null);
      
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  };

  // Update password
  const updatePassword = async (password: string) => {
    try {
      const { data, error } = await supabase.auth.updateUser({ password });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  };

  // Initialize auth state and set up listener
  useEffect(() => {
    console.log("Setting up auth state listeners");
    let authListenerUnsubscribe: (() => void) | undefined;
    
    // Get initial session
    const initializeAuth = async () => {
      try {
        console.log("Initializing auth state");
        setLoading(true);
        
        // Setting up auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log("Auth state changed:", event, session?.user?.email);
          setSession(session);
          setUser(session?.user ?? null);
          
          // Fetch profile on auth change if user is logged in
          if (session?.user) {
            // Use setTimeout to avoid potential deadlocks
            setTimeout(async () => {
              const profile = await fetchProfile(session.user.id);
              console.log("Setting profile after auth change:", profile);
              setProfile(profile);
            }, 0);
          } else {
            setProfile(null);
          }
          
          setLoading(false);
        });
        
        authListenerUnsubscribe = () => {
          subscription.unsubscribe();
        };

        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const profile = await fetchProfile(session.user.id);
          console.log("Setting profile on init:", profile);
          setProfile(profile);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        toast({
          title: 'Ошибка авторизации',
          description: 'Не удалось получить данные пользователя',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
        setInitialized(true);
        console.log("Auth initialization complete");
      }
    };

    initializeAuth();

    return () => {
      if (authListenerUnsubscribe) {
        authListenerUnsubscribe();
      }
    };
  }, []);

  return {
    user,
    session,
    profile,
    loading,
    initialized,
    isSuperAdmin,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    resetPassword,
    updatePassword,
  };
};
