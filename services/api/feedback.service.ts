import type { ApiResponse } from '@/types/api';
import { apiClient } from './client';

export type ApiFeedbackCategory = 'bug_report' | 'suggestion' | 'other';
export type FeedbackCategory = ApiFeedbackCategory | 'Bug Report' | 'Suggestion' | 'Something Else' | 'Other';

export interface FeedbackPayload {
  category: FeedbackCategory;
  message?: string;
  feedback_text?: string;
  attachmentUrl?: string | null;
  screenshot_url?: string | null;
  attachment_url?: string | null;
  allowFollowup?: boolean;
  allow_contact?: boolean;
  allow_followup?: boolean;
  appVersion?: string;
  app_version?: string;
  deviceOs?: string;
  device_os?: string;
  hunter_id?: string;
  email?: string;
  device_os_version?: string;
  device_model?: string;
  level?: number;
  rank?: string;
  timestamp?: string;
}

export interface FeedbackResponseData {
  id?: string | number;
  feedbackId?: string | number;
  ticketId?: number | string;
  ticket_id?: number | string;
  message?: string;
  status?: string;
  received_at?: string;
}

export interface UserFeedbackItem {
  id: string | number;
  ticketId?: number | string;
  ticket_id?: number | string;
  category: 'bug_report' | 'suggestion' | 'other' | string;
  message?: string;
  feedback_text?: string;
  status: 'received' | 'in_review' | 'resolved' | string;
  attachmentUrl?: string | null;
  attachment_url?: string | null;
  createdAt?: string;
  created_at?: string;
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

function mapCategoryToApi(cat: FeedbackCategory): ApiFeedbackCategory {
  if (cat === 'Bug Report' || cat === 'bug_report') return 'bug_report';
  if (cat === 'Suggestion' || cat === 'suggestion') return 'suggestion';
  return 'other';
}

export async function sendFeedback(payload: FeedbackPayload): Promise<FeedbackResponseData> {
  const msg = payload.message || payload.feedback_text || '';
  const apiCategory = mapCategoryToApi(payload.category);
  const attachment = payload.attachmentUrl ?? payload.screenshot_url ?? payload.attachment_url ?? null;
  const followup = payload.allowFollowup ?? payload.allow_contact ?? payload.allow_followup ?? true;
  const version = payload.appVersion || payload.app_version || '1.0.0';
  const os = payload.deviceOs || payload.device_os || 'iOS';

  const body = {
    category: apiCategory,
    message: msg,
    feedback_text: msg,
    attachmentUrl: attachment,
    attachment_url: attachment,
    screenshot_url: attachment,
    allowFollowup: followup,
    allow_contact: followup,
    allow_followup: followup,
    appVersion: version,
    app_version: version,
    deviceOs: os,
    device_os: os,
  };

  try {
    const { data } = await apiClient.post<ApiResponse<FeedbackResponseData>>('/feedback', body);
    if (data && typeof data === 'object' && 'success' in data && (data as any).success === false) {
      throw new Error((data as any).error?.message || (data as any).message || 'Failed to submit feedback');
    }
    const result = (data as any)?.data || data;
    return result;
  } catch (err: any) {
    const isNotFound = err?.response?.status === 404 || (err?.message && err.message.includes('404'));
    if (isNotFound) {
      try {
        const { data } = await apiClient.post<ApiResponse<FeedbackResponseData>>('/api/feedback', body);
        if (data && typeof data === 'object' && 'success' in data && (data as any).success === false) {
          throw new Error((data as any).error?.message || (data as any).message || 'Failed to submit feedback');
        }
        return (data as any)?.data || data;
      } catch (innerErr: any) {
        throw new Error(extractErrorMessage(innerErr));
      }
    }
    throw new Error(extractErrorMessage(err));
  }
}

function extractFeedbackList(resData: any): UserFeedbackItem[] {
  if (!resData) return [];
  if (Array.isArray(resData)) return resData;
  if (Array.isArray(resData.data)) return resData.data;
  if (Array.isArray(resData.feedback)) return resData.feedback;
  if (Array.isArray(resData.data?.feedback)) return resData.data.feedback;
  if (Array.isArray(resData.items)) return resData.items;
  if (Array.isArray(resData.data?.items)) return resData.data.items;
  if (Array.isArray(resData.results)) return resData.results;
  return [];
}

export async function fetchMyFeedback(): Promise<UserFeedbackItem[]> {
  try {
    const { data } = await apiClient.get<ApiResponse<UserFeedbackItem[]>>('/feedback/mine');
    if (data && typeof data === 'object' && 'success' in data && (data as any).success === false) {
      throw new Error((data as any).error?.message || (data as any).message || 'Failed to fetch feedback history');
    }
    return extractFeedbackList(data);
  } catch (err: any) {
    const isNotFound = err?.response?.status === 404 || (err?.message && err.message.includes('404'));
    if (isNotFound) {
      try {
        const { data } = await apiClient.get<ApiResponse<UserFeedbackItem[]>>('/api/feedback/mine');
        if (data && typeof data === 'object' && 'success' in data && (data as any).success === false) {
          throw new Error((data as any).error?.message || (data as any).message || 'Failed to fetch feedback history');
        }
        return extractFeedbackList(data);
      } catch (innerErr: any) {
        console.warn('[FeedbackService] fetchMyFeedback error:', innerErr);
        return [];
      }
    }
    console.warn('[FeedbackService] fetchMyFeedback error:', err);
    return [];
  }
}

