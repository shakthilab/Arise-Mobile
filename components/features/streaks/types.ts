export type StreakReminderStage = 'active_warning' | 'weak' | 'lost';

export interface StreakStageConfig {
  stage: StreakReminderStage;
  badgeLabel: string;
  badgeColor?: string;
  title: string;
  subtitle: string;
  buttonLabel: string;
  missedDays: number;
  streakLost?: boolean;
}

export interface StreakFireProps {
  stage?: StreakReminderStage;
  size?: number;
  scale?: number;
  showParticles?: boolean;
  style?: any;
}
