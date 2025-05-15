
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cleanupAuthState } from './utils';

/**
 * Signs up a new user with email and password
 */
export const signUp = async (email: string, password: string) => {
  try {
    console.log("Starting sign up process");
    // Clean up existing auth state
    cleanupAuthState();
    
    const { error } = await supabase.auth.signUp({ email, password });
    
    if (!error) {
      toast({
        title: "Регистрация успешна",
        description: "Проверьте почту для подтверждения"
      });
      console.log("Sign up successful");
    } else {
      console.error("Sign up error:", error);
    }
    
    return { error };
  } catch (error) {
    console.error('Error signing up:', error);
    return { error };
  }
};

/**
 * Signs in an existing user with email and password
 */
export const signIn = async (email: string, password: string) => {
  try {
    console.log("Starting sign in process");
    // Clean up existing auth state
    cleanupAuthState();
    
    // Attempt global sign out first
    try {
      console.log("Performing global sign out before sign in");
      await supabase.auth.signOut({ scope: 'global' });
    } catch (err) {
      console.warn("Global sign out failed, continuing anyway:", err);
      // Continue even if this fails
    }
    
    console.log("Signing in with email and password");
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (!error) {
      // Successfully signed in
      console.log("Sign in successful:", data.user?.email);
      toast({
        title: "Вход выполнен",
        description: "Добро пожаловать в KIRA AI"
      });
      // Перенаправление будет выполнено в onAuthStateChange
    } else {
      console.error("Sign in error:", error);
    }
    
    return { data, error };
  } catch (error) {
    console.error('Error signing in:', error);
    return { data: null, error };
  }
};

/**
 * Signs out the current user
 */
export const signOut = async () => {
  try {
    console.log("Starting sign out process");
    // Clean up auth state
    cleanupAuthState();
    
    // Attempt global sign out
    console.log("Performing global sign out");
    const { error } = await supabase.auth.signOut({ scope: 'global' });
    
    if (!error) {
      console.log("Sign out complete, redirecting to auth page");
      // Use a basic redirect instead of navigate
      window.location.href = '/auth';
    }
    
    return { error: null };
  } catch (error) {
    console.error('Error signing out:', error);
    return { error };
  }
};

/**
 * Requests a password reset for the provided email
 */
export const requestPasswordReset = async (email: string) => {
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

/**
 * Resets the password for the current user
 */
export const resetPassword = async (newPassword: string) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    
    if (!error) {
      toast({
        title: "Пароль изменен",
        description: "Вы можете использовать новый пароль для входа"
      });
    }
    
    return { error };
  } catch (error) {
    console.error('Error resetting password:', error);
    return { error };
  }
};
