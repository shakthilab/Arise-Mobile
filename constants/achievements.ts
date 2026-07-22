export type AchievementDefinition = {
  id: string;
  title: string;
  description: string;
};

/**
 * PLACEHOLDER set — real achievement list belongs to product/design.
 */
export const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
  { id: 'first-mission', title: 'First Steps', description: 'Complete your first mission.' },
  { id: 'streak-7', title: 'Week One', description: 'Reach a 7-day streak.' },
];
