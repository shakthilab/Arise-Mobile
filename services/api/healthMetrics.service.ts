import { apiClient } from './client';
import type { ApiResponse } from '@/types/api';

export interface HealthMetricPayload {
  date: string; // ISO date string YYYY-MM-DD
  steps: number;
  calories: number;
  distanceKm: number;
  activeMinutes: number;
  avgHeartRate?: number;
  sleepMinutes?: number;
  workoutCount?: number;
}

export interface BackendDailyMetricItem {
  id?: string;
  date: string; // YYYY-MM-DD
  steps: number;
  calories: number;
  distanceKm: number;
  activeMinutes: number;
  avgHeartRate: number;
  sleepMinutes: number;
  workoutCount: number;
}

export interface HealthMetricsRangeResponse {
  range: 'week' | 'month' | 'year';
  totals: {
    steps: number;
    calories: number;
    distanceKm: number;
    activeMinutes: number;
    avgHeartRate: number;
    sleepMinutes: number;
    workoutCount: number;
  };
  daily: BackendDailyMetricItem[];
}

export const healthMetricsService = {
  /**
   * POST /api/users/me/health-metrics
   * Syncs daily health summary (yesterday's finalized or today's partial data)
   */
  syncDailyMetrics: async (payload: HealthMetricPayload): Promise<boolean> => {
    try {
      const response = await apiClient.post<ApiResponse<{ success: boolean }>>(
        '/users/me/health-metrics',
        payload
      );
      return response.data?.success ?? true;
    } catch (error) {
      console.warn('[HealthMetricsService] syncDailyMetrics failed:', error);
      return false;
    }
  },

  /**
   * GET /api/users/me/health-metrics?range=week|month|year
   * Fetches aggregated metrics and daily array from backend
   */
  getHealthMetrics: async (
    range: 'week' | 'month' | 'year'
  ): Promise<HealthMetricsRangeResponse | null> => {
    try {
      const response = await apiClient.get<ApiResponse<HealthMetricsRangeResponse>>(
        '/users/me/health-metrics',
        { params: { range } }
      );
      if (response.data && response.data.success) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.warn(`[HealthMetricsService] getHealthMetrics(${range}) failed:`, error);
      return null;
    }
  },
};
