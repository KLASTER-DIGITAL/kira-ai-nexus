
import { Session, User } from '@supabase/supabase-js';
import { UserProfile, UserRole } from '@/types/auth';

/**
 * Authentication state interface
 */
export interface AuthState {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

/**
 * Props for the authentication context
 */
export interface AuthContextProps extends AuthState {
  signUp: (email: string, password: string) => Promise<{ error: any | null }>;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<{ error: any | null }>;
  resetPassword: (newPassword: string) => Promise<{ error: any | null }>;
  isSuperAdmin: () => boolean;
}
