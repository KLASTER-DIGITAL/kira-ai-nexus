
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cleanupAuthState } from './utils';

/**
 * Signs up a new user with email and password
 */
export const signUp = async (email: string, password: string) => {
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

/**
 * Signs in an existing user with email and password
 */
export const signIn = async (email: string, password: string) => {
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

/**
 * Signs out the current user
 */
export const signOut = async () => {
  try {
    // Clean up auth state
    cleanupAuthState();
    
    // Attempt global sign out
    await supabase.auth.signOut({ scope: 'global' });
    
    // Force page reload for a clean state
    window.location.href = '/auth';
  } catch (error) {
    console.error('Error signing out:', error);
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
