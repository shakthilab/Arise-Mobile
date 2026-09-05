import React from 'react';
import { StreakFireVisual } from './StreakFireVisual';
import type { StreakFireProps } from './types';

/**
 * Stage 1: Active Warning Flame (Missed 1 Day)
 * Energetic, full-bodied flame with floating embers and vivid radiant glow.
 */
export function StreakFireActive(props: Omit<StreakFireProps, 'stage'>) {
  return <StreakFireVisual stage="active_warning" {...props} />;
}
