export type User = {
  id: string;
  displayName: string;
  email: string;
  avatarUrl: string | null;
  level: number;
  xp: number;
  currentStreak: number;
  longestStreak: number;
  createdAt: string;
  // Present on the real backend response (GET /auth/me, login, etc.) but
  // optional here since callers elsewhere construct partial/placeholder
  // User objects that predate this field.
  onboarding_done?: boolean;
  daily_protein_goal?: number | null;
  weeklyStreak?: number;
  completedDaysCount?: number;
  user_progression?: {
    id?: string;
    total_xp?: number;
    current_level?: number;
    daily_streak?: number;
    weekly_streak?: number;
    longest_streak?: number;
    last_active_date?: string;
  };
};

export type AuthSession = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
};
