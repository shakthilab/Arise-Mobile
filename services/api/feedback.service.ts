import type { ApiResponse } from '@/types/api';
import { apiClient } from './client';

export type FeedbackCategory = 'Bug Report' | 'Suggestion' | 'Something Else';

export interface FeedbackPayload {
  category: FeedbackCategory;
  feedback_text: string;
  screenshot_url?: string | null;
  allow_contact: boolean;
  hunter_id?: string;
  email?: string;
  app_version?: string;
  device_os?: string;
  device_os_version?: string;
  device_model?: string;
  level?: number;
  rank?: string;
  timestamp: string;
}

export interface FeedbackResponseData {
  id?: string;
  message?: string;
  received_at?: string;
}

/**
 * Sends in-app user feedback to the HunterX Backend API (/feedback or /api/feedback).
 */
export async function sendFeedback(payload: FeedbackPayload): Promise<FeedbackResponseData> {
  const { data } = await apiClient.post<ApiResponse<FeedbackResponseData>>('/feedback', payload);
  if (!data.success) {
    throw new Error(data.error?.message || 'Failed to submit feedback transmission');
  }
  return data.data;
}
