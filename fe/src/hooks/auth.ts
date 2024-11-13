import { useContext } from 'react';
import { AuthContext } from '@/types/auth';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth() hook must be used within AuthProvider.');
  }
  return context;
};
