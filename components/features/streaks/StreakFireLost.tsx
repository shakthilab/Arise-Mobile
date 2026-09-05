import React from 'react';
import { StreakFireVisual } from './StreakFireVisual';
import type { StreakFireProps } from './types';

/**
 * Stage 3: Sad / Lost Flame (Streak Lost)
 * Compact drooping flame with faint smoke wisps and melancholic anime expression.
 */
export function StreakFireLost(props: Omit<StreakFireProps, 'stage'>) {
  return <StreakFireVisual stage="lost" {...props} />;
}
