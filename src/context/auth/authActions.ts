
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { cleanupAuthState } from './utils';
import { logAuthEvent, logAuthError } from "@/features/auth/utils/authDebug";

/**
 * Signs up a new user with email and password
 */
export const signUp = async (email: string, password: string) => {
  try {
    logAuthEvent("Starting sign up process", { email });
    // Clean up existing auth state
    cleanupAuthState();
    
    const { error } = await supabase.auth.signUp({ email, password });
    
    if (!error) {
      toast.success("Регистрация успешна", {
        description: "Проверьте почту для подтверждения"
      });
      logAuthEvent("Sign up successful", { email });
    } else {
      logAuthError("Sign up error", error);
    }
    
    return { error };
  } catch (error) {
    logAuthError("Error signing up", error);
    toast.error("Ошибка регистрации", { 
      description: (error as Error).message
    });
    return { error };
  }
};

/**
 * Signs in an existing user with email and password
 */
export const signIn = async (email: string, password: string) => {
  try {
    logAuthEvent("Starting sign in process", { email });
    // Clean up existing auth state
    cleanupAuthState();
    
    // Attempt global sign out first
    try {
      logAuthEvent("Performing global sign out before sign in");
      await supabase.auth.signOut({ scope: 'global' });
    } catch (err) {
      logAuthError("Global sign out failed, continuing anyway", err);
      // Continue even if this fails
    }
    
    logAuthEvent("Signing in with email and password", { email });
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (!error) {
      // Successfully signed in
      logAuthEvent("Sign in successful", { userId: data.user?.id, email: data.user?.email });
      toast.success("Вход выполнен", {
        description: "Добро пожаловать в KIRA AI"
      });
      // Перенаправление будет выполнено в onAuthStateChange
    } else {
      logAuthError("Sign in error", error);
      if (error.message.includes('Invalid login credentials')) {
        toast.error("Неверный email или пароль");
      } else {
        toast.error(`Ошибка входа: ${error.message}`);
      }
    }
    
    return { data, error };
  } catch (error) {
    logAuthError("Exception signing in", error);
    toast.error("Ошибка входа", { 
      description: (error as Error).message
    });
    return { data: null, error };
  }
};

/**
 * Signs out the current user
 */
export const signOut = async () => {
  try {
    logAuthEvent("Starting sign out process");
    // Clean up auth state
    cleanupAuthState();
    
    // Attempt global sign out
    logAuthEvent("Performing global sign out");
    const { error } = await supabase.auth.signOut({ scope: 'global' });
    
    if (!error) {
      logAuthEvent("Sign out complete, redirecting to auth page");
      // Use a basic redirect instead of navigate
      window.location.href = '/auth';
    } else {
      logAuthError("Sign out error", error);
      toast.error("Ошибка при выходе из системы");
    }
    
    return { error: null };
  } catch (error) {
    logAuthError("Exception signing out", error);
    toast.error("Ошибка при выходе из системы");
    return { error };
  }
};

/**
 * Requests a password reset for the provided email
 */
export const requestPasswordReset = async (email: string) => {
  try {
    logAuthEvent("Requesting password reset", { email });
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (!error) {
      toast.success("Запрос отправлен", {
        description: "Проверьте почту для сброса пароля"
      });
      logAuthEvent("Password reset request sent", { email });
    } else {
      logAuthError("Password reset request error", error);
      toast.error(`Ошибка запроса сброса пароля: ${error.message}`);
    }
    
    return { error };
  } catch (error) {
    logAuthError("Exception requesting password reset", error);
    toast.error("Ошибка запроса сброса пароля");
    return { error };
  }
};

/**
 * Resets the password for the current user
 */
export const resetPassword = async (newPassword: string) => {
  try {
    logAuthEvent("Resetting password");
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    
    if (!error) {
      toast.success("Пароль изменен", {
        description: "Вы можете использовать новый пароль для входа"
      });
      logAuthEvent("Password reset successful");
    } else {
      logAuthError("Password reset error", error);
      toast.error(`Ошибка сброса пароля: ${error.message}`);
    }
    
    return { error };
  } catch (error) {
    logAuthError("Exception resetting password", error);
    toast.error("Ошибка сброса пароля");
    return { error };
  }
};
