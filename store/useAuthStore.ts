import { create } from 'zustand';

import * as authService from '@/services/api/auth.service';
import type { User } from '@/types/user';

type AuthState = {
  user: User | null;
  isAuthenticating: boolean;
  isOnboarded: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (payload: authService.RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  completeOnboarding: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticating: false,
  isOnboarded: true,

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

  logout: async () => {
    await authService.logout();
    set({ user: null });
  },

  setUser: (user) => set({ user }),
  completeOnboarding: () => set({ isOnboarded: true }),
}));
