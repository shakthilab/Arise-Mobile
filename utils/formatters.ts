export function formatXp(xp: number): string {
  return xp.toLocaleString('en-US');
}

export function formatStreak(days: number): string {
  return `${days} day${days === 1 ? '' : 's'}`;
}
