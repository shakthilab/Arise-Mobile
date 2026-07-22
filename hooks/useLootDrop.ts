import { useCallback, useState } from 'react';

import { rollLootRarity } from '@/utils/lootDrop';
import type { LootRarity } from '@/types/mission';

export function useLootDrop() {
  const [lastDrop, setLastDrop] = useState<LootRarity | null>(null);

  const roll = useCallback(() => {
    const rarity = rollLootRarity();
    setLastDrop(rarity);
    return rarity;
  }, []);

  return { lastDrop, roll };
}
