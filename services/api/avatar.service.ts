import { useEffect, useState } from 'react';
import { Image as ExpoImage } from 'expo-image';
import type { ApiResponse } from '@/types/api';
import { apiClient } from './client';
import { AVATAR_THUMB_WIDTH, optimizeCloudinaryUrl } from '@/services/media/cloudinary';

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

// Lets components (e.g. the Profile/Home avatar) re-render once the avatar
// catalog finishes loading, so `getAvatarSource` can resolve the real image
// for a user's avatar_id instead of being stuck on the generic fallback that
// it returns while `cachedAvatars` is still empty.
type Listener = () => void;
const listeners = new Set<Listener>();

function notifyAvatarsReady() {
  listeners.forEach((listener) => listener());
}

// Warms expo-image's memory+disk cache for the whole avatar catalog as soon
// as it's fetched, so the picker grid (and any avatar picked from it) is
// already cached by the time a user opens it instead of loading blank.
// Non-blocking: a failed prefetch just falls back to the normal on-demand
// load, same as preloadAssets.ts does for the static app graphics.
function prefetchAvatarImages(list: AvatarItem[]) {
  Promise.allSettled(
    list
      .filter((a) => a.image_url)
      .map((a) => ExpoImage.prefetch(optimizeCloudinaryUrl(a.image_url, AVATAR_THUMB_WIDTH), 'memory-disk'))
  ).catch(() => {});
}

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
        prefetchAvatarImages(cachedAvatars);
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
            prefetchAvatarImages(cachedAvatars);
            return cachedAvatars;
          }
        } catch {
          // Ignore inner error
        }
      }
    } finally {
      fetchPromise = null;
      notifyAvatarsReady();
    }
    return cachedAvatars || [];
  })();

  return fetchPromise;
}

export function getCachedAvatars(): AvatarItem[] | null {
  return cachedAvatars;
}

/**
 * Forces a re-render once the avatar catalog has loaded. Mount this in any
 * screen that renders the current user's avatar via `getAvatarSource` so it
 * doesn't get stuck showing the generic fallback image while
 * `cachedAvatars` is still empty (e.g. on a cold app start).
 */
export function useAvatarsReady(): boolean {
  const [ready, setReady] = useState(!!cachedAvatars);

  useEffect(() => {
    if (cachedAvatars) {
      setReady(true);
      return;
    }

    const listener = () => setReady(!!cachedAvatars);
    listeners.add(listener);
    getAvatars().catch(() => {});

    return () => {
      listeners.delete(listener);
    };
  }, []);

  return ready;
}
