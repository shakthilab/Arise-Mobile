import { useAuthStore } from '@/store/useAuthStore';

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticating = useAuthStore((state) => state.isAuthenticating);
  const isOnboarded = useAuthStore((state) => state.isOnboarded);
  const login = useAuthStore((state) => state.login);
  const signup = useAuthStore((state) => state.signup);
  const logout = useAuthStore((state) => state.logout);
  const completeOnboarding = useAuthStore((state) => state.completeOnboarding);

  return {
    user,
    isAuthenticated: user !== null,
    isAuthenticating,
    isOnboarded,
    login,
    signup,
    logout,
    completeOnboarding,
  };
}

