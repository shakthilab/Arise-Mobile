import { create } from 'zustand';

import type { OnboardingAnswerPayload } from '@/services/api/auth.service';

type OnboardingStore = {
  // User Profile fields
  hunterName: string;
  gender: 'male' | 'female' | 'other';
  age: number;
  height: number; // CM internally
  heightUnit: 'cm' | 'ft';
  weight: number; // KG internally
  weightUnit: 'kg' | 'lbs';
  weaknesses: string[];
  rank: string | null;
  verifiedEmail: string | null;

  // Motivation screen selection ("What do you want to level up?")
  motivationIds: string[];

  // Time screen selection ("Commit daily")
  dailyTimeId: string | null;
  dailyTimeLabel: string | null; // display only — shown in the oath summary
  // Canonical backend value, one of "15min" | "30min" | "1hr" | "2hr_plus".
  // Kept separate from dailyTimeLabel (which is display-formatted, e.g.
  // "1h") because the backend's protein-goal multiplier lookup needs these
  // exact strings.
  dailyTimeAnswer: string | null;

  // Setters
  setHunterName: (name: string) => void;
  setGender: (gender: 'male' | 'female' | 'other') => void;
  setAge: (age: number) => void;
  setHeight: (height: number) => void;
  setHeightUnit: (unit: 'cm' | 'ft') => void;
  setWeight: (weight: number) => void;
  setWeightUnit: (unit: 'kg' | 'lbs') => void;
  setWeaknesses: (weaknesses: string[]) => void;
  setRank: (rank: string) => void;
  setVerifiedEmail: (email: string | null) => void;
  setMotivationIds: (ids: string[]) => void;
  setDailyTimeId: (id: string) => void;
  setDailyTimeLabel: (label: string) => void;
  setDailyTimeAnswer: (answer: string) => void;

  // Reset all onboarding data
  resetOnboarding: () => void;
};

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  // Initial state
  hunterName: '',
  gender: 'male',
  age: 24,
  height: 181,
  heightUnit: 'cm',
  weight: 75.0,
  weightUnit: 'kg',
  weaknesses: [],
  rank: null,
  verifiedEmail: null,
  motivationIds: [],
  dailyTimeId: null,
  dailyTimeLabel: null,
  dailyTimeAnswer: null,

  // Setters
  setHunterName: (name) => set({ hunterName: name }),
  setGender: (gender) => set({ gender }),
  setAge: (age) => set({ age }),
  setHeight: (height) => set({ height }),
  setHeightUnit: (heightUnit) => set({ heightUnit }),
  setWeight: (weight) => set({ weight }),
  setWeightUnit: (weightUnit) => set({ weightUnit }),
  setWeaknesses: (weaknesses) => set({ weaknesses }),
  setRank: (rank) => set({ rank }),
  setVerifiedEmail: (email) => set({ verifiedEmail: email }),
  setMotivationIds: (ids) => set({ motivationIds: ids }),
  setDailyTimeId: (id) => set({ dailyTimeId: id }),
  setDailyTimeLabel: (label) => set({ dailyTimeLabel: label }),
  setDailyTimeAnswer: (answer) => set({ dailyTimeAnswer: answer }),

  resetOnboarding: () =>
    set({
      hunterName: '',
      gender: 'male',
      age: 24,
      height: 181,
      heightUnit: 'cm',
      weight: 75.0,
      weightUnit: 'kg',
      weaknesses: [],
      rank: null,
      verifiedEmail: null,
      motivationIds: [],
      dailyTimeId: null,
      dailyTimeLabel: null,
      dailyTimeAnswer: null,
    }),
}));

/**
 * Maps the wizard's collected answers onto the backend's fixed 1-10
 * questionId scheme. Shared by signup (email + Google) and by the oath
 * screen when it's finishing onboarding for an account that already
 * exists (Google sign-in from the Login screen, before this wizard ran).
 */
export function buildOnboardingAnswers(): OnboardingAnswerPayload[] {
  const state = useOnboardingStore.getState();

  const formattedHeight =
    state.heightUnit === 'ft'
      ? `${(state.height / 30.48).toFixed(1)}ft`
      : `${Math.round(state.height)}cm`;

  const formattedWeight =
    state.weightUnit === 'lbs'
      ? `${Math.round(state.weight * 2.20462)}lbs`
      : `${Math.round(state.weight)}kg`;

  return [
    { questionId: 1, answer: state.hunterName || 'Hunter' },
    { questionId: 2, answer: state.gender || 'male' },
    { questionId: 3, answer: (state.age || 24).toString() },
    { questionId: 4, answer: formattedHeight },
    { questionId: 5, answer: formattedWeight },
    { questionId: 6, answer: state.motivationIds.length > 0 ? state.motivationIds.join(',') : 'discipline' },
    { questionId: 7, answer: state.weaknesses.length > 0 ? state.weaknesses.join(',') : 'none' },
    { questionId: 8, answer: state.rank || 'beginner' },
    { questionId: 9, answer: state.dailyTimeAnswer || '30min' },
    { questionId: 10, answer: 'accepted' },
  ];
}
