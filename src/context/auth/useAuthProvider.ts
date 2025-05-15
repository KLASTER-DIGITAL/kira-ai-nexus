
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

/**
 * Hook that provides authentication functionality to the AuthContext
 */
export const useAuthProvider = (): AuthContextProps => {
  const authState = useAuthState();
  const navigate = useNavigate();

  // Helper function to check if user is superadmin
  const isSuperAdmin = () => {
    const isSuperAdminUser = checkIsSuperAdmin(authState.profile);
    console.log("isSuperAdmin check:", { 
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
    signOut, // The type is now correctly matched in the interface
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
