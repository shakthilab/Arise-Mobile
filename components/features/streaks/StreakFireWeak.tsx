import React from 'react';
import { StreakFireVisual } from './StreakFireVisual';
import type { StreakFireProps } from './types';

/**
 * Stage 2: Weak Flame (Missed 2 Days)
 * Dimmer, smaller flame with sluggish embers and slower flicker.
 */
export function StreakFireWeak(props: Omit<StreakFireProps, 'stage'>) {
  return <StreakFireVisual stage="weak" {...props} />;
}
