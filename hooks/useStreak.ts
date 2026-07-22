import { useMemo } from 'react';

import { isStreakAlive } from '@/utils/streakCalculator';

export function useStreak(currentStreak: number, lastCompletedAt: string | null) {
  return useMemo(() => {
    const lastDate = lastCompletedAt ? new Date(lastCompletedAt) : null;
    const alive = lastDate ? isStreakAlive(lastDate) : false;
    return {
      count: alive ? currentStreak : 0,
      isAtRisk: alive && lastDate !== null && lastDate.toDateString() !== new Date().toDateString(),
    };
  }, [currentStreak, lastCompletedAt]);
}
