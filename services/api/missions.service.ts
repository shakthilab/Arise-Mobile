import type { ApiResponse } from '@/types/api';
import type { Mission } from '@/types/mission';

import { apiClient } from './client';

export async function fetchMissions(): Promise<Mission[]> {
  const { data } = await apiClient.get<ApiResponse<Mission[]>>('/missions');
  if (!data.success) throw new Error(data.error.message);
  return data.data;
}

export async function completeMission(missionId: string): Promise<Mission> {
  const { data } = await apiClient.post<ApiResponse<Mission>>(`/missions/${missionId}/complete`);
  if (!data.success) throw new Error(data.error.message);
  return data.data;
}
