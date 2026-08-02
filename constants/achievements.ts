export type AchievementDefinition = {
  id: string;
  codeNumber?: string;
  title: string;
  level: string;
  subtier: string;
  description: string;
  iconName: string;
  xpReward: number;
  unlocked: boolean;
  progress: number; // 0 to 100
};

export const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
  {
    id: 'speed-strike',
    title: 'SPEED STRIKE',
    level: 'LVL 10',
    subtier: 'MAX SPEED',
    description: 'Achieved max velocity and lightning sprint frequency during high-intensity intervals.',
    iconName: 'flash',
    xpReward: 1500,
    unlocked: true,
    progress: 100,
  },
  {
    id: 'titan-force',
    title: 'TITAN FORCE',
    level: 'LVL 18',
    subtier: 'POWER RATING 5000',
    description: 'Surpassed 5,000 lbs in total heavy compound kinetic force output.',
    iconName: 'barbell',
    xpReward: 2500,
    unlocked: true,
    progress: 100,
  },
  {
    id: 'phoenix-heart',
    title: 'PHOENIX HEART',
    level: 'LVL 12',
    subtier: 'REVIVE MASTER',
    description: 'Maintained rapid VO2 max recovery rate and heart rate normalization post-workout.',
    iconName: 'heart',
    xpReward: 1800,
    unlocked: true,
    progress: 100,
  },
  {
    id: 'stealth-shadow',
    title: 'STEALTH SHADOW',
    level: 'LVL 9',
    subtier: 'NIGHT OPS',
    description: 'Executed 10 consecutive undetected midnight training sessions in silent mode.',
    iconName: 'skull',
    xpReward: 1200,
    unlocked: true,
    progress: 100,
  },
  {
    id: 'vanguard-shield',
    title: 'VANGUARD SHIELD',
    level: 'LVL 14',
    subtier: 'DEFENSE 3800',
    description: 'Accumulated 3,800 points of core stamina resilience and injury resistance.',
    iconName: 'shield-checkmark',
    xpReward: 2000,
    unlocked: true,
    progress: 100,
  },
  {
    id: 'viper-strike',
    title: 'VIPER STRIKE',
    level: 'LVL 11',
    subtier: 'CRITICAL HIT',
    description: 'Delivered 100% form accuracy and critical hits across 50 workout sets.',
    iconName: 'pulse',
    xpReward: 1600,
    unlocked: true,
    progress: 100,
  },
];
