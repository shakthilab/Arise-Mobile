import { useCallback, useState } from 'react';
import type { StreakReminderStage } from './types';
import { resolveStreakStage } from './StreakReminderModal';

export interface UseStreakReminderOptions {
  initialMissedDays?: number;
  initialStreakLost?: boolean;
  autoCheckOnMount?: boolean;
}

export function useStreakReminder(options?: UseStreakReminderOptions) {
  const [visible, setVisible] = useState(false);
  const [missedDays, setMissedDays] = useState(options?.initialMissedDays ?? 1);
  const [streakLost, setStreakLost] = useState(options?.initialStreakLost ?? false);
  const [manualStage, setManualStage] = useState<StreakReminderStage | null>(null);

  const activeStage = manualStage ?? resolveStreakStage(missedDays, streakLost);

  const showReminder = useCallback((days: number = 1, isLost: boolean = false) => {
    setMissedDays(days);
    setStreakLost(isLost);
    setManualStage(null);
    setVisible(true);
  }, []);

  const showStage = useCallback((stage: StreakReminderStage) => {
    setManualStage(stage);
    setVisible(true);
  }, []);

  const hideReminder = useCallback(() => {
    setVisible(false);
  }, []);

  return {
    visible,
    activeStage,
    missedDays,
    streakLost,
    showReminder,
    showStage,
    hideReminder,
  };
}
