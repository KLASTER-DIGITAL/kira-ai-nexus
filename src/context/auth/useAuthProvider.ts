
import { useNavigate } from 'react-router-dom';
import { useAuthState } from './useAuthState';
import { 
  signUp,
  signIn,
  signOut,
  requestPasswordReset,
  resetPassword,
} from './authActions';
import { isSuperAdmin as checkIsSuperAdmin } from './utils';

export const useAuthProvider = () => {
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
    ...authState,
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
