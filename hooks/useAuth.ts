import { useAuthStore } from '@/store/useAuthStore';

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticating = useAuthStore((state) => state.isAuthenticating);
  const login = useAuthStore((state) => state.login);
  const signup = useAuthStore((state) => state.signup);
  const logout = useAuthStore((state) => state.logout);

  return {
    user,
    isAuthenticated: user !== null,
    isAuthenticating,
    login,
    signup,
    logout,
  };
}
