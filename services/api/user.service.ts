import type { ApiResponse } from '@/types/api';
import { apiClient } from './client';

export interface UserActivitySummary {
  member_since?: string;
  current_streak?: number;
  best_record?: number;
  total_quests_cleared?: number;
}

export interface UserActivityLog {
  id: string | number;
  task_id?: string | number;
  title: string;
  xp_earned: number;
  schedule_date?: string | null;
  completed_at?: string;
  day_number?: number;
  date_label?: string;
}

export interface UserActivityPagination {
  page: number;
  limit: number;
  total_count: number;
  total_pages: number;
  has_next_page: boolean;
}

export interface UserActivityData {
  summary: UserActivitySummary;
  logs: UserActivityLog[];
  pagination: UserActivityPagination;
}

function extractErrorMessage(err: any): string {
  if (err?.response?.data) {
    const data = err.response.data;
    if (typeof data === 'string') return data;
    if (data.message && typeof data.message === 'string') return data.message;
    if (data.error) {
      if (typeof data.error === 'string') return data.error;
      if (data.error.message && typeof data.error.message === 'string') return data.error.message;
    }
  }
  if (err?.message && typeof err.message === 'string') return err.message;
  return 'An unexpected error occurred';
}

export async function fetchUserActivity(page = 1, limit = 10): Promise<UserActivityData> {
  try {
    const { data } = await apiClient.get<ApiResponse<UserActivityData>>('/users/activity', {
      params: { page, limit },
    });
    if (data && typeof data === 'object' && 'success' in data && data.success === false) {
      throw new Error((data as any).error?.message || 'Failed to fetch activity');
    }
    const result = (data as any)?.data || data;
    return result;
  } catch (err: any) {
    const isNotFound = err?.response?.status === 404 || (err?.message && err.message.includes('404'));
    if (isNotFound) {
      try {
        const { data } = await apiClient.get<ApiResponse<UserActivityData>>('/api/users/activity', {
          params: { page, limit },
        });
        if (data && typeof data === 'object' && 'success' in data && data.success === false) {
          throw new Error((data as any).error?.message || 'Failed to fetch activity');
        }
        return (data as any)?.data || data;
      } catch (innerErr: any) {
        throw new Error(extractErrorMessage(innerErr));
      }
    }
    throw new Error(extractErrorMessage(err));
  }
}
