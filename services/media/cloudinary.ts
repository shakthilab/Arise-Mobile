// services/media/cloudinary.ts — Upload a local image straight to Cloudinary
//
// The file never touches our backend. We ask it for a short-lived signature
// (services/api/media.service.ts), then POST the file directly to
// Cloudinary's upload API using that signature. The Cloudinary API secret
// never leaves the backend.

import { fetchCloudinarySignature, type CloudinaryFolder } from '@/services/api/media.service';

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
}

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
  // React Native's FormData accepts this { uri, name, type } shape in place
  // of a real Blob/File.
  formData.append('file', { uri: localUri, name: filename, type: mimeType } as any);
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
