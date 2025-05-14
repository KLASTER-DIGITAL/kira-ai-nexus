
import { useNavigate } from 'react-router-dom';
import { useAuthState } from './useAuthState';
import { 
  signUp,
  signIn,
  signOut,
  requestPasswordReset,
  resetPassword,
} from './authActions';

export const useAuthProvider = () => {
  const authState = useAuthState();
  const navigate = useNavigate();

  // Helper function to check if user is superadmin
  const isSuperAdmin = () => {
    console.log("isSuperAdmin check:", authState.profile?.role);
    return authState.profile?.role === 'superadmin';
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
