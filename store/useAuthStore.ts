import { create } from 'zustand';

import * as authService from '@/services/api/auth.service';
import { tokenStorage } from '@/services/api/tokenStorage';
import type { User } from '@/types/user';

type AuthState = {
  user: User | null;
  isAuthenticating: boolean;
  isOnboarded: boolean;
  // True until restoreSession() resolves on app start. Routing decisions
  // (see app/index.tsx) must wait for this — otherwise a page refresh sees
  // the initial user:null before the stored session has a chance to load
  // and bounces straight to login even though the tokens are still valid.
  isBootstrapping: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (payload: authService.RegisterPayload) => Promise<void>;
  loginWithGoogle: (
    idToken: string,
    onboarding?: authService.OnboardingAnswerPayload[]
  ) => Promise<{ isNew: boolean }>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  completeOnboarding: () => void;
  submitOnboarding: (onboarding: authService.OnboardingAnswerPayload[]) => Promise<void>;
  restoreSession: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticating: false,
  isOnboarded: true,
  isBootstrapping: true,

  login: async (email, password) => {
    set({ isAuthenticating: true });
    try {
      const user = await authService.login(email, password);
      set({ user });
    } finally {
      set({ isAuthenticating: false });
    }
  },

  signup: async (payload) => {
    set({ isAuthenticating: true });
    try {
      const user = await authService.signup(payload);
      set({ user, isOnboarded: false });
    } finally {
      set({ isAuthenticating: false });
    }
  },

  loginWithGoogle: async (idToken, onboarding = []) => {
    set({ isAuthenticating: true });
    try {
      const { user, isNew } = await authService.loginWithGoogle(idToken, onboarding);
      set({ user, isOnboarded: !isNew });
      return { isNew };
    } finally {
      set({ isAuthenticating: false });
    }
  },

  logout: async () => {
    await authService.logout();
    set({ user: null });
  },

  setUser: (user) => set({ user }),
  completeOnboarding: () => set({ isOnboarded: true }),

  submitOnboarding: async (onboarding) => {
    set({ isAuthenticating: true });
    try {
      const user = await authService.completeOnboarding(onboarding);
      set({ user, isOnboarded: true });
    } finally {
      set({ isAuthenticating: false });
    }
  },

  restoreSession: async () => {
    try {
      const accessToken = await tokenStorage.getAccessToken();
      if (!accessToken) {
        set({ isBootstrapping: false });
        return;
      }
      const user = await authService.getCurrentUser();
      set({ user, isOnboarded: !!user.onboarding_done, isBootstrapping: false });
    } catch {
      // Token missing/expired and refresh (handled inside apiClient) failed too.
      await tokenStorage.clearTokens();
      set({ user: null, isBootstrapping: false });
    }
  },
}));
