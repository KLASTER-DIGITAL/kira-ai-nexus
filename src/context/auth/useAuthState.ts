
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { fetchUserProfile, getRedirectPath } from './utils';
import { AuthState } from './types';

const initialState: AuthState = {
  session: null,
  user: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,
};

/**
 * Hook responsible for managing auth state and setting up auth listeners
 */
export const useAuthState = () => {
  const [state, setState] = useState<AuthState>(initialState);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true }));

        // Set up auth state listener first
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log("Auth state changed:", event, session?.user?.email);
            
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
              setState(prev => ({ ...prev, session, user: session?.user || null }));

              // Defer profile fetching to prevent potential deadlocks
              if (session?.user) {
                setTimeout(async () => {
                  const profile = await fetchUserProfile(session.user.id);
                  console.log("Fetched profile after sign in:", profile);
                  
                  setState(prev => ({ 
                    ...prev, 
                    profile,
                    isAuthenticated: true,
                    isLoading: false 
                  }));

                  // Redirect based on role after login
                  if (profile) {
                    const redirectPath = getRedirectPath(profile);
                    console.log("Redirecting to:", redirectPath, "based on role:", profile.role);
                    navigate(redirectPath, { replace: true });
                  }
                }, 0);
              }
            } else if (event === 'SIGNED_OUT') {
              console.log("User signed out");
              setState({ 
                session: null,
                user: null,
                profile: null,
                isLoading: false,
                isAuthenticated: false
              });
              // Force redirect to auth page on sign out
              navigate('/auth', { replace: true });
            }
          }
        );

        // Then check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Existing session check:", session?.user?.email);
        
        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id);
          console.log("Initial profile load:", profile);
          
          setState({
            session,
            user: session.user,
            profile,
            isLoading: false,
            isAuthenticated: true
          });
          
          // Check if we need to redirect based on current URL and role
          if (profile) {
            const currentPath = window.location.pathname;
            console.log("Current path check:", currentPath, "role:", profile.role);
            
            // Redirect if user is on the wrong dashboard or at root paths
            if ((currentPath === '/dashboard/user' && profile.role === 'superadmin') ||
                (currentPath === '/dashboard/admin' && profile.role !== 'superadmin') ||
                (currentPath === '/dashboard' || currentPath === '/')) {
              const redirectPath = getRedirectPath(profile);
              console.log("Initial redirect to:", redirectPath);
              navigate(redirectPath, { replace: true });
            }
          }
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

  return state;
};
