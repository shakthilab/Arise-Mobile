import { MAX_LEVEL, XP_CURVE_BASE, XP_CURVE_EXPONENT } from '@/constants/xpTable';

/** Total cumulative XP required to reach `level` (level 1 = 0 XP). */
export function xpRequiredForLevel(level: number): number {
  if (level <= 1) return 0;
  return Math.round(XP_CURVE_BASE * Math.pow(level - 1, XP_CURVE_EXPONENT));
}

export function levelForXp(totalXp: number): number {
  let level = 1;
  while (level < MAX_LEVEL && totalXp >= xpRequiredForLevel(level + 1)) {
    level += 1;
  }
  return level;
}

export type XpProgress = {
  level: number;
  currentLevelXp: number;
  xpIntoLevel: number;
  xpToNextLevel: number;
  progress: number; // 0..1
};

export function getXpProgress(totalXp: number): XpProgress {
  const level = levelForXp(totalXp);
  const currentLevelXp = xpRequiredForLevel(level);
  const nextLevelXp = level >= MAX_LEVEL ? currentLevelXp : xpRequiredForLevel(level + 1);
  const xpIntoLevel = totalXp - currentLevelXp;
  const xpToNextLevel = Math.max(nextLevelXp - totalXp, 0);
  const span = nextLevelXp - currentLevelXp;

  return {
    level,
    currentLevelXp,
    xpIntoLevel,
    xpToNextLevel,
    progress: span > 0 ? Math.min(xpIntoLevel / span, 1) : 1,
  };
}
