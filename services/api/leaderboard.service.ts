import type { ApiResponse } from '@/types/api';

import { apiClient } from './client';

export type LeaderboardEntry = {
  userId: string;
  displayName: string;
  level: number;
  xp: number;
  rank: number;
};

export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  const { data } = await apiClient.get<ApiResponse<LeaderboardEntry[]>>('/leaderboard');
  if (!data.success) throw new Error(data.error.message);
  return data.data;
}
