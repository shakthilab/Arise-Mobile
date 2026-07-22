import { create } from 'zustand';

import * as authService from '@/services/api/auth.service';
import type { User } from '@/types/user';

type AuthState = {
  user: User | null;
  isAuthenticating: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticating: false,

  login: async (email, password) => {
    set({ isAuthenticating: true });
    try {
      const user = await authService.login(email, password);
      set({ user });
    } finally {
      set({ isAuthenticating: false });
    }
  },

  signup: async (email, password, displayName) => {
    set({ isAuthenticating: true });
    try {
      const user = await authService.signup(email, password, displayName);
      set({ user });
    } finally {
      set({ isAuthenticating: false });
    }
  },

  logout: async () => {
    await authService.logout();
    set({ user: null });
  },

  setUser: (user) => set({ user }),
}));
