
import React, { createContext, useState, useEffect, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AuthState, UserProfile } from '@/types/auth';

const initialState: AuthState = {
  session: null,
  user: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,
};

interface AuthContextProps extends AuthState {
  signUp: (email: string, password: string) => Promise<{ error: any | null }>;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<{ error: any | null }>;
  resetPassword: (newPassword: string) => Promise<{ error: any | null }>;
  isSuperAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);
  const navigate = useNavigate();

  // Clean up auth state in localStorage
  const cleanupAuthState = () => {
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

  const fetchUserProfile = async (userId: string) => {
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

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true }));

        // Set up auth state listener first
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
              setState(prev => ({ ...prev, session, user: session?.user || null }));

              // Defer profile fetching to prevent potential deadlocks
              if (session?.user) {
                setTimeout(async () => {
                  const profile = await fetchUserProfile(session.user.id);
                  
                  setState(prev => ({ 
                    ...prev, 
                    profile,
                    isAuthenticated: true,
                    isLoading: false 
                  }));

                  // Redirect based on role after login
                  if (profile && profile.role === 'superadmin') {
                    navigate('/dashboard/admin');
                  } else {
                    navigate('/dashboard/user');
                  }
                }, 0);
              }
            } else if (event === 'SIGNED_OUT') {
              setState({ 
                session: null,
                user: null,
                profile: null,
                isLoading: false,
                isAuthenticated: false
              });
              // Force redirect to auth page on sign out
              navigate('/auth');
            }
          }
        );

        // Then check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id);
          
          setState({
            session,
            user: session.user,
            profile,
            isLoading: false,
            isAuthenticated: true
          });
        } else {
          setState(prev => ({ ...prev, isLoading: false }));
        }

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Error setting up auth:", error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initializeAuth();
  }, [navigate]);

  // Authentication functions
  const signUp = async (email: string, password: string) => {
    try {
      // Clean up existing auth state
      cleanupAuthState();
      
      const { error } = await supabase.auth.signUp({ email, password });
      
      if (!error) {
        toast({
          title: "Регистрация успешна",
          description: "Проверьте почту для подтверждения"
        });
      }
      
      return { error };
    } catch (error) {
      console.error('Error signing up:', error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Clean up existing auth state
      cleanupAuthState();
      
      // Attempt global sign out first
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (!error) {
        // Successfully signed in
        toast({
          title: "Вход выполнен",
          description: "Добро пожаловать в KIRA AI"
        });
        // Перенаправление будет выполнено в onAuthStateChange
      }
      
      return { error };
    } catch (error) {
      console.error('Error signing in:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      // Clean up auth state
      cleanupAuthState();
      
      // Attempt global sign out
      await supabase.auth.signOut({ scope: 'global' });
      
      // Reset state
      setState({
        session: null,
        user: null,
        profile: null,
        isLoading: false,
        isAuthenticated: false
      });
      
      // Force page reload for a clean state
      window.location.href = '/auth';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const requestPasswordReset = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (!error) {
        toast({
          title: "Запрос отправлен",
          description: "Проверьте почту для сброса пароля"
        });
      }
      
      return { error };
    } catch (error) {
      console.error('Error requesting password reset:', error);
      return { error };
    }
  };

  const resetPassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (!error) {
        toast({
          title: "Пароль изменен",
          description: "Вы можете использовать новый пароль для входа"
        });
        navigate('/auth');
      }
      
      return { error };
    } catch (error) {
      console.error('Error resetting password:', error);
      return { error };
    }
  };

  // Helper function to check if user is superadmin
  const isSuperAdmin = () => {
    return state.profile?.role === 'superadmin';
  };

  const value = {
    ...state,
    signUp,
    signIn,
    signOut,
    requestPasswordReset,
    resetPassword,
    isSuperAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
