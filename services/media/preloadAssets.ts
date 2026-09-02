import { Image as ExpoImage } from 'expo-image';
import { Image as RNImage } from 'react-native';
import { CLOUDINARY_ASSETS } from '@/constants/cloudinaryAssets';

/**
 * Preloads and warms the memory and disk caches for all remote Cloudinary assets
 * so they render instantly with zero delay, blank screen, or flickering.
 */
export async function preloadAppAssets(): Promise<void> {
  const imageUrls = Object.values(CLOUDINARY_ASSETS)
    .map((asset) => asset.uri)
    .filter((uri) => !uri.includes('/video/upload/') && !uri.endsWith('.mp3'));

  // Pre-cache all images in parallel across expo-image and React Native image caches
  await Promise.allSettled(
    imageUrls.map(async (url) => {
      try {
        await Promise.all([
          ExpoImage.prefetch(url, 'memory-disk'),
          RNImage.prefetch(url),
        ]);
      } catch (e) {
        // Non-blocking: individual prefetch failure will gracefully fallback to on-demand load
      }
    })
  );
}
