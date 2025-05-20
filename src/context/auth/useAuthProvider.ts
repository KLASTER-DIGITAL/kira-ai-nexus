
import { useNavigate } from 'react-router-dom';
import { useAuthState } from './useAuthState';
import { AuthContextProps } from './types';
import { 
  signUp,
  signIn,
  signOut,
  requestPasswordReset,
  resetPassword,
} from './authActions';
import { isSuperAdmin as checkIsSuperAdmin } from './utils';
import { debugAuthState, logAuthEvent } from '@/features/auth/utils/authDebug';

/**
 * Hook that provides authentication functionality to the AuthContext
 */
export const useAuthProvider = (): AuthContextProps => {
  const authState = useAuthState();
  const navigate = useNavigate();

  // Debug auth state
  debugAuthState(authState.session, authState.user, authState.profile);

  // Helper function to check if user is superadmin
  const isSuperAdmin = () => {
    const isSuperAdminUser = checkIsSuperAdmin(authState.profile);
    logAuthEvent('isSuperAdmin check', { 
      role: authState.profile?.role, 
      isSuperAdmin: isSuperAdminUser,
      profile: authState.profile
    });
    return isSuperAdminUser;
  };

  return {
    // Auth state
    session: authState.session,
    user: authState.user,
    profile: authState.profile,
    isLoading: authState.loading,
    isAuthenticated: !!authState.user,
    
    // Auth methods
    signUp,
    signIn,
    signOut, 
    requestPasswordReset,
    resetPassword: async (newPassword: string) => {
      const { error } = await resetPassword(newPassword);
      if (!error) {
        navigate('/auth');
      }
      return { error };
    },
    isSuperAdmin
  };
};
