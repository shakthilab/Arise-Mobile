import { useMemo } from 'react';

import { getXpProgress } from '@/utils/xpCalculator';

export function useXP(totalXp: number) {
  return useMemo(() => getXpProgress(totalXp), [totalXp]);
}
