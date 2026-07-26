import { create } from 'zustand';

type OnboardingStore = {
  // Motivation screen selection ("What do you want to level up?")
  motivationId: string | null;
  setMotivationId: (id: string) => void;

  // Time screen selection ("Commit daily")
  dailyTimeLabel: string | null;
  setDailyTimeLabel: (label: string) => void;

  // Reset all onboarding data
  resetOnboarding: () => void;
};

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  motivationId: null,
  setMotivationId: (id) => set({ motivationId: id }),

  dailyTimeLabel: null,
  setDailyTimeLabel: (label) => set({ dailyTimeLabel: label }),

  resetOnboarding: () =>
    set({
      motivationId: null,
      dailyTimeLabel: null,
    }),
}));
