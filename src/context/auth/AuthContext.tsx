
import React, { createContext, useContext } from 'react';
import { AuthContextProps } from './types';
import { useAuthProvider } from './useAuthProvider';

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const authState = useAuthProvider();
  return <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
