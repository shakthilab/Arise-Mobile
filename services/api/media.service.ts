import type { ApiResponse } from '@/types/api';

import { apiClient } from './client';

export type CloudinaryFolder = 'avatars' | 'guest-pass' | 'task-proof' | 'misc';

export interface CloudinarySignature {
  timestamp: number;
  signature: string;
  folder: string;
  apiKey: string;
  cloudName: string;
}

export async function fetchCloudinarySignature(
  folder: CloudinaryFolder = 'misc'
): Promise<CloudinarySignature> {
  const { data } = await apiClient.post<ApiResponse<CloudinarySignature>>('/media/signature', {
    folder,
  });
  if (!data.success) {
    throw new Error(data.error?.message || 'Failed to get upload signature');
  }
  return data.data;
}
