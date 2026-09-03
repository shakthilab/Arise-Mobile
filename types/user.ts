export type WeekStatusDay = {
  date: string;
  day: string;
  status: 'DONE' | 'COMPLETED' | 'MISSED' | 'FAILED' | 'SKIPPED' | 'NOT_STARTED' | 'REST' | 'FREEZE' | string;
};

export type WeekStatus = {
  week_start: string;
  week_end: string;
  days: WeekStatusDay[];
};

export type User = {
  id: string;
  displayName: string;
  name?: string;
  email: string;
  avatarUrl: string | null;
  level: number;
  xp: number;
  currentStreak: number;
  longestStreak: number;
  createdAt: string;
  gender?: string;
  height_cm?: number;
  weight_kg?: number;
  height?: number;
  weight?: number;
  date_of_birth?: string;
  dob?: string;
  birthday?: string;
  daily_protein_goal?: number | null;
  protein_goal?: number | null;
  onboarding_done?: boolean;
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
  week_status?: WeekStatus;
};

export type AuthSession = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
};
