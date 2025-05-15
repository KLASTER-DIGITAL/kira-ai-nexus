
import { Session, User } from "@supabase/supabase-js";
import { UserProfile } from "@/types/auth";

export interface AuthState {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
}

export interface AuthContextProps {
  // Auth state
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Auth methods
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signOut: () => Promise<{ error: any }>;
  requestPasswordReset: (email: string) => Promise<{ error: any }>;
  resetPassword: (newPassword: string) => Promise<{ error: any }>;
  
  // Role checks
  isSuperAdmin: () => boolean;
}
