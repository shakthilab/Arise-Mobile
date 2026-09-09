import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import type { ApiResponse } from '@/types/api';
import { apiClient } from './client';

export interface RatingPayload {
  stars?: number;
  rating?: number;
  comment?: string;
  feedback?: string;
  category?: string | null;
  app_version?: string;
  device_os?: string;
}

export interface RatingResponseData {
  promptStoreReview?: boolean;
  message?: string;
  [key: string]: any;
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

export async function submitRating(payload: RatingPayload): Promise<RatingResponseData> {
  const starsVal = payload.stars ?? payload.rating ?? 5;
  const commentVal = payload.comment ?? payload.feedback ?? '';
  
  const body = {
    stars: starsVal,
    rating: starsVal,
    comment: commentVal,
    feedback: commentVal,
    category: payload.category ?? null,
    app_version: payload.app_version || Constants.expoConfig?.version || '1.0.0',
    device_os: payload.device_os || Device.osName || Platform.OS,
  };

  try {
    const { data } = await apiClient.post<ApiResponse<RatingResponseData>>('/ratings', body);
    if (data && typeof data === 'object' && 'success' in data && (data as any).success === false) {
      throw new Error((data as any).error?.message || (data as any).message || 'Failed to submit rating');
    }
    const promptStoreReview = typeof (data as any)?.promptStoreReview === 'boolean'
      ? (data as any).promptStoreReview
      : typeof (data as any)?.data?.promptStoreReview === 'boolean'
      ? (data as any).data.promptStoreReview
      : false;

    const result = (data as any)?.data || data;
    return {
      ...result,
      promptStoreReview,
    };
  } catch (err: any) {
    const isNotFound = err?.response?.status === 404 || (err?.message && err.message.includes('404'));
    if (isNotFound) {
      try {
        const { data } = await apiClient.post<ApiResponse<RatingResponseData>>('/api/ratings', body);
        if (data && typeof data === 'object' && 'success' in data && (data as any).success === false) {
          throw new Error((data as any).error?.message || (data as any).message || 'Failed to submit rating');
        }
        const promptStoreReview = typeof (data as any)?.promptStoreReview === 'boolean'
          ? (data as any).promptStoreReview
          : typeof (data as any)?.data?.promptStoreReview === 'boolean'
          ? (data as any).data.promptStoreReview
          : false;

        const result = (data as any)?.data || data;
        return {
          ...result,
          promptStoreReview,
        };
      } catch (innerErr: any) {
        throw new Error(extractErrorMessage(innerErr));
      }
    }
    throw new Error(extractErrorMessage(err));
  }
}
