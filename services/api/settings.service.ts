import type { ApiResponse } from '@/types/api';
import { apiClient } from './client';

export interface UserSettings {
  id?: string;
  user_id?: string;
  units: 'metric' | 'imperial';
  notify_all: boolean;
  notify_daily_motivation: boolean;
  notify_task_reminders: boolean;
  notify_streak_preservation: boolean;
  notify_streak_milestones: boolean;
  notify_streak_freeze: boolean;
  notify_level_up: boolean;
  notify_reward_ready: boolean;
  notify_announcements: boolean;
  created_at?: string;
  updated_at?: string;
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

export async function getUserSettings(): Promise<UserSettings> {
  try {
    const { data } = await apiClient.get<ApiResponse<{ settings: UserSettings } | UserSettings>>('/users/me/settings');
    if (data && typeof data === 'object' && 'success' in data && data.success === false) {
      throw new Error((data as any).error?.message || 'Failed to fetch user settings');
    }
    const result = (data as any)?.data?.settings || (data as any)?.data || (data as any)?.settings || data;
    return result;
  } catch (err: any) {
    const isNotFound = err?.response?.status === 404 || (err?.message && err.message.includes('404'));
    if (isNotFound) {
      try {
        const { data } = await apiClient.get<ApiResponse<{ settings: UserSettings } | UserSettings>>('/api/users/me/settings');
        if (data && typeof data === 'object' && 'success' in data && data.success === false) {
          throw new Error((data as any).error?.message || 'Failed to fetch user settings');
        }
        const result = (data as any)?.data?.settings || (data as any)?.data || (data as any)?.settings || data;
        return result;
      } catch (innerErr: any) {
        throw new Error(extractErrorMessage(innerErr));
      }
    }
    throw new Error(extractErrorMessage(err));
  }
}

export async function updateUserSettings(partial: Partial<UserSettings>): Promise<UserSettings> {
  try {
    const { data } = await apiClient.patch<ApiResponse<{ settings: UserSettings } | UserSettings>>('/users/me/settings', partial);
    if (data && typeof data === 'object' && 'success' in data && data.success === false) {
      throw new Error((data as any).error?.message || 'Failed to update user settings');
    }
    const result = (data as any)?.data?.settings || (data as any)?.data || (data as any)?.settings || data;
    return result;
  } catch (err: any) {
    const isNotFound = err?.response?.status === 404 || (err?.message && err.message.includes('404'));
    if (isNotFound) {
      try {
        const { data } = await apiClient.patch<ApiResponse<{ settings: UserSettings } | UserSettings>>('/api/users/me/settings', partial);
        if (data && typeof data === 'object' && 'success' in data && data.success === false) {
          throw new Error((data as any).error?.message || 'Failed to update user settings');
        }
        const result = (data as any)?.data?.settings || (data as any)?.data || (data as any)?.settings || data;
        return result;
      } catch (innerErr: any) {
        throw new Error(extractErrorMessage(innerErr));
      }
    }
    throw new Error(extractErrorMessage(err));
  }
}
