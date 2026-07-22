export type MissionStatus = 'pending' | 'completed' | 'missed';

export type Mission = {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  status: MissionStatus;
  dueDate: string;
};

export type LootRarity = 'common' | 'rare' | 'epic' | 'legendary';

export type LootDrop = {
  id: string;
  name: string;
  rarity: LootRarity;
  awardedAt: string;
};
