import { STREAK_GRACE_PERIOD_HOURS } from '@/constants/streakRules';

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

/**
 * A streak stays alive if the last completion was today, yesterday, or
 * within the grace window past yesterday's end-of-day.
 */
export function isStreakAlive(lastCompletedAt: Date, now: Date = new Date()): boolean {
  const diffMs = now.getTime() - lastCompletedAt.getTime();
  return diffMs <= DAY_MS + STREAK_GRACE_PERIOD_HOURS * HOUR_MS;
}

export function nextStreakCount(currentStreak: number, lastCompletedAt: Date | null, now: Date = new Date()): number {
  if (!lastCompletedAt) return 1;
  if (!isStreakAlive(lastCompletedAt, now)) return 1;

  const sameCalendarDay = lastCompletedAt.toDateString() === now.toDateString();
  return sameCalendarDay ? currentStreak : currentStreak + 1;
}
