import { useAuthStore } from '@/store/useAuthStore';

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticating = useAuthStore((state) => state.isAuthenticating);
  const isOnboarded = useAuthStore((state) => state.isOnboarded);
  const login = useAuthStore((state) => state.login);
  const signup = useAuthStore((state) => state.signup);
  const loginWithGoogle = useAuthStore((state) => state.loginWithGoogle);
  const logout = useAuthStore((state) => state.logout);
  const completeOnboarding = useAuthStore((state) => state.completeOnboarding);
  const submitOnboarding = useAuthStore((state) => state.submitOnboarding);
  const isBootstrapping = useAuthStore((state) => state.isBootstrapping);
  const restoreSession = useAuthStore((state) => state.restoreSession);

  return {
    user,
    isAuthenticated: user !== null,
    isAuthenticating,
    isOnboarded,
    isBootstrapping,
    login,
    signup,
    loginWithGoogle,
    logout,
    completeOnboarding,
    submitOnboarding,
    restoreSession,
  };
}

