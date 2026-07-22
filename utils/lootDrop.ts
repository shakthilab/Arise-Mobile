import type { LootRarity } from '@/types/mission';

/**
 * PLACEHOLDER odds — not final, pending product sign-off. Weights are
 * relative, not percentages; roll() normalizes internally.
 */
export const LOOT_RARITY_WEIGHTS: Record<LootRarity, number> = {
  common: 70,
  rare: 22,
  epic: 7,
  legendary: 1,
};

export function rollLootRarity(random: number = Math.random()): LootRarity {
  const entries = Object.entries(LOOT_RARITY_WEIGHTS) as [LootRarity, number][];
  const totalWeight = entries.reduce((sum, [, weight]) => sum + weight, 0);
  let threshold = random * totalWeight;

  for (const [rarity, weight] of entries) {
    if (threshold < weight) return rarity;
    threshold -= weight;
  }
  return entries[entries.length - 1][0];
}
