
import React, { createContext, useContext } from 'react';
import { AuthContextProps } from './types';
import { useAuthProvider } from './useAuthProvider';

// Create a context with a default undefined value
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use the auth provider hook to get authentication state and methods
  const authState = useAuthProvider();
  
  // Provide the auth state to the component tree
  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
