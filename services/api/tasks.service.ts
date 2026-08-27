import type { ApiResponse } from '@/types/api';
import type { TasksTodayData, CompleteTaskData, TaskStatus, ReopenTaskData } from '@/types/task';

import { apiClient } from './client';

export async function fetchTasksToday(): Promise<TasksTodayData> {
  const { data } = await apiClient.get<ApiResponse<TasksTodayData>>('/tasks/today');
  if (!data.success) {
    throw new Error(data.error?.message || 'Failed to fetch today\'s tasks');
  }
  return data.data;
}

export async function completeTask(
  taskId: string,
  status: TaskStatus
): Promise<CompleteTaskData> {
  const { data } = await apiClient.put<ApiResponse<CompleteTaskData>>(
    `/tasks/${taskId}/complete`,
    { status }
  );
  if (!data.success) {
    throw new Error(data.error?.message || 'Failed to update task status');
  }
  return data.data;
}

export async function reopenTask(taskId: string): Promise<ReopenTaskData> {
  const { data } = await apiClient.put<ApiResponse<ReopenTaskData>>(
    `/tasks/${taskId}/reopen`
  );
  if (!data.success) {
    throw new Error(data.error?.message || 'Failed to reopen task');
  }
  return data.data;
}
