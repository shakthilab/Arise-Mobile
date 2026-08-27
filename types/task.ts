export type TaskStatus = 'PENDING' | 'PARTIAL' | 'COMPLETED' | 'SKIPPED';
export type TaskType = 'DAILY_FIXED' | 'DAILY_ADMIN' | 'WEEKLY';

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  tag: string;
  image_url: string | null;
  task_type: TaskType;
  xp_reward: number;
  xp_partial: number;
  allows_partial: boolean;
  target_value: number | null;
  target_unit: string | null;
  is_recurring: boolean;
  status: TaskStatus;
  progress_value: number | null;
  xp_earned: number;
  completed_at: string | null;
}

export interface TasksTodayData {
  date: string;
  week_start: string;
  daily: TaskItem[];
  weekly: TaskItem[];
  daily_xp_earned: number;
  daily_xp_possible: number;
  weekly_xp_earned: number;
  weekly_xp_possible: number;
}

export interface CompleteTaskData {
  task_id: string;
  title: string;
  task_type: TaskType;
  status: TaskStatus;
  progress_value: number | null;
  target_value: number | null;
  target_unit: string | null;
  xp_reward: number;
  xp_partial: number;
  xp_earned: number;
  completed_at: string | null;
  total_xp: number;
  daily_streak: number;
  longest_streak: number;
}

export interface ReopenTaskData {
  task_id: string;
  title: string;
  task_type: TaskType;
  status: 'PENDING';
}
