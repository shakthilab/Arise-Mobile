// services/media/cloudinary.ts — Upload a local image straight to Cloudinary
//
// The file never touches our backend. We ask it for a short-lived signature
// (services/api/media.service.ts), then POST the file directly to
// Cloudinary's upload API using that signature. The Cloudinary API secret
// never leaves the backend.

import { Platform } from 'react-native';

import { fetchCloudinarySignature, type CloudinaryFolder } from '@/services/api/media.service';

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
}

/**
 * Rewrites a Cloudinary delivery URL to request an auto-format,
 * auto-quality, width-capped variant instead of the original upload.
 *
 * Dynamic content (e.g. task images, avatars) is stored as the raw
 * `secure_url` Cloudinary hands back on upload — full-resolution, whatever
 * format the device captured. Inserting a transformation segment into the
 * URL path needs no re-upload; Cloudinary generates/caches the derived
 * asset the first time it's requested. Non-Cloudinary URLs are returned
 * unchanged.
 *
 * Some URLs (e.g. the static app assets in constants/cloudinaryAssets.ts)
 * already carry a `f_auto,q_auto` transform baked in. Rather than stacking
 * a second transformation segment on top of it — which Cloudinary would
 * happily do, generating a wasted extra derived image — this detects an
 * existing transform segment and replaces it with the requested one.
 */
export function optimizeCloudinaryUrl(url: string, maxWidth = 800): string {
  const marker = '/image/upload/';
  const idx = url.indexOf(marker);
  if (idx === -1) {
    return url;
  }
  const insertAt = idx + marker.length;
  const rest = url.slice(insertAt);
  const transformSegment = `f_auto,q_auto,w_${maxWidth},c_limit`;

  // A Cloudinary path looks like .../upload/<transform>/<version>/<public_id>
  // or .../upload/<version>/<public_id> when nothing was applied yet. A
  // version segment is `v` followed only by digits; a transform segment is
  // one or more comma-separated `key_value` pairs — anything else that
  // isn't a version segment.
  const slashIdx = rest.indexOf('/');
  const firstSegment = slashIdx === -1 ? rest : rest.slice(0, slashIdx);
  const isVersionSegment = /^v\d+$/.test(firstSegment);
  const isTransformSegment = !isVersionSegment && /^[a-z]{1,3}_[^/]+$/i.test(firstSegment);

  if (isTransformSegment) {
    const remainder = slashIdx === -1 ? '' : rest.slice(slashIdx);
    return `${url.slice(0, insertAt)}${transformSegment}${remainder}`;
  }

  return `${url.slice(0, insertAt)}${transformSegment}/${rest}`;
}

/** Small neutral-gray blurhash used as a universal image placeholder so a
 * remote image never renders as a blank gap while it loads — expo-image
 * shows this instantly, then cross-fades to the real image once it's
 * fetched/decoded (or found in cache). */
export const DEFAULT_BLURHASH = 'L6PZfSi_.AyE_3t7t7R**0o#DgR4';

/** Target width for avatar thumbnails — small on screen everywhere they
 * appear, so there's no reason to ever pull the full-resolution original. */
export const AVATAR_THUMB_WIDTH = 160;

/**
 * Uploads a local image (e.g. an expo-image-picker asset URI, or a
 * react-native-view-shot capture URI) to Cloudinary and returns its
 * hosted URL.
 */
export async function uploadImageToCloudinary(
  localUri: string,
  folder: CloudinaryFolder = 'misc'
): Promise<CloudinaryUploadResult> {
  const { timestamp, signature, folder: signedFolder, apiKey, cloudName } =
    await fetchCloudinarySignature(folder);

  const filename = localUri.split('/').pop() || `upload-${timestamp}.jpg`;
  const extMatch = /\.(\w+)$/.exec(filename);
  const ext = (extMatch?.[1] || 'jpg').toLowerCase();
  const mimeType = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';

  const formData = new FormData();
  if (Platform.OS === 'web') {
    // Web's FormData is spec-compliant: it only accepts a string or a real
    // Blob/File for the value, silently stringifying anything else to
    // "[object Object]". Resolve the local/blob URI to an actual Blob first.
    const fileBlob = await (await fetch(localUri)).blob();
    formData.append('file', fileBlob, filename);
  } else {
    // React Native's native FormData accepts this { uri, name, type } shape
    // in place of a real Blob/File.
    formData.append('file', { uri: localUri, name: filename, type: mimeType } as any);
  }
  formData.append('api_key', apiKey);
  formData.append('timestamp', String(timestamp));
  formData.append('signature', signature);
  formData.append('folder', signedFolder);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json?.error?.message || 'Image upload failed');
  }

  return {
    url: json.secure_url as string,
    publicId: json.public_id as string,
    width: json.width as number,
    height: json.height as number,
  };
}
