import type { ApiResponse } from '@/types/api';
import { apiClient } from './client';

export interface AvatarItem {
  id: string;
  name: string;
  image_url: string;
  gender?: string;
  is_default?: boolean;
  unlock_at_level?: number;
}

let cachedAvatars: AvatarItem[] | null = null;
let fetchPromise: Promise<AvatarItem[]> | null = null;

export async function getAvatars(): Promise<AvatarItem[]> {
  if (cachedAvatars && cachedAvatars.length > 0) {
    return cachedAvatars;
  }
  if (fetchPromise) {
    return fetchPromise;
  }

  fetchPromise = (async () => {
    try {
      const { data } = await apiClient.get<ApiResponse<{ avatars: AvatarItem[] } | AvatarItem[]>>('/avatars');
      const rawList = (data as any)?.data?.avatars || (data as any)?.data || (data as any)?.avatars || data;
      if (Array.isArray(rawList) && rawList.length > 0) {
        cachedAvatars = rawList.map((a: any) => ({
          id: String(a.id),
          name: a.name || `Avatar ${a.id}`,
          image_url: a.image_url || a.imageUrl || a.url || '',
          gender: a.gender,
          is_default: !!a.is_default,
          unlock_at_level: a.unlock_at_level ?? 0,
        }));
        return cachedAvatars;
      }
    } catch (err: any) {
      const isNotFound = err?.response?.status === 404 || (err?.message && err.message.includes('404'));
      if (isNotFound) {
        try {
          const { data } = await apiClient.get<ApiResponse<{ avatars: AvatarItem[] } | AvatarItem[]>>('/api/avatars');
          const rawList = (data as any)?.data?.avatars || (data as any)?.data || (data as any)?.avatars || data;
          if (Array.isArray(rawList) && rawList.length > 0) {
            cachedAvatars = rawList.map((a: any) => ({
              id: String(a.id),
              name: a.name || `Avatar ${a.id}`,
              image_url: a.image_url || a.imageUrl || a.url || '',
              gender: a.gender,
              is_default: !!a.is_default,
              unlock_at_level: a.unlock_at_level ?? 0,
            }));
            return cachedAvatars;
          }
        } catch {
          // Ignore inner error
        }
      }
    } finally {
      fetchPromise = null;
    }
    return cachedAvatars || [];
  })();

  return fetchPromise;
}

export function getCachedAvatars(): AvatarItem[] | null {
  return cachedAvatars;
}
