/**
 * Google Sign-In — hands back just the ID token our backend verifies
 * (POST /api/auth/google), on whichever platform we're running on:
 *
 * - iOS/Android: @react-native-google-signin/google-signin (native module).
 *   Requires a development build (EAS or local prebuild) — not available
 *   inside Expo Go, so it's lazy-loaded and guarded below to avoid crashing
 *   the whole login/signup screen when running under Expo Go.
 * - web: no web target for that native module, so we use Google's OAuth
 *   implicit ID-token flow instead — see ./googleAuthWeb.
 */
import { Platform } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';

import { env } from '@/config/env';
import { GoogleSignInCancelledError } from './errors';

export { GoogleSignInCancelledError };

const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
const isNative = Platform.OS !== 'web';

// Lazily resolved only on a native dev/production build — requiring this
// module in Expo Go or on web throws immediately since neither ships the
// native binding.
let googleSignInModule: typeof import('@react-native-google-signin/google-signin') | null = null;
if (isNative && !isExpoGo) {
  googleSignInModule = require('@react-native-google-signin/google-signin');
  googleSignInModule!.GoogleSignin.configure({
    // webClientId is what the backend checks the token's audience against —
    // required on both iOS and Android for a backend-verifiable ID token.
    webClientId: env.googleClientIdWeb,
    iosClientId: env.googleClientIdIos,
    offlineAccess: false,
  });
}

/** Runs the platform-appropriate Google sign-in flow and returns the ID token to send to the backend. */
export async function signInWithGoogle(): Promise<string> {
  if (Platform.OS === 'web') {
    const { signInWithGoogleWeb } = await import('./googleAuthWeb');
    return signInWithGoogleWeb();
  }

  if (!googleSignInModule) {
    throw new Error(
      'Google sign-in requires a development build — it is not available in Expo Go.'
    );
  }
  const { GoogleSignin } = googleSignInModule;

  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

  const response = await GoogleSignin.signIn();
  if (response.type === 'cancelled') {
    throw new GoogleSignInCancelledError();
  }

  const idToken = response.data.idToken;
  if (!idToken) {
    throw new Error('Google did not return an ID token — check webClientId configuration');
  }

  return idToken;
}

export function isGoogleSignInCancelled(err: unknown): boolean {
  if (err instanceof GoogleSignInCancelledError) return true;
  if (!googleSignInModule) return false;
  return (err as { code?: string })?.code === googleSignInModule.statusCodes.SIGN_IN_CANCELLED;
}
