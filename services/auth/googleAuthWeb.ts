/**
 * Web Google Sign-In — the native module used on iOS/Android
 * (@react-native-google-signin/google-signin) has no web target, so web
 * uses Google's OAuth 2.0 implicit ID-token flow via expo-auth-session
 * instead. It's issued against the same webClientId as native, so the
 * resulting ID token's audience matches what the backend already verifies
 * for POST /api/auth/google.
 *
 * NOTE: the redirect URI expo-auth-session generates for this origin must
 * be added to the Web client's "Authorized redirect URIs" in Google Cloud
 * Console, or Google will reject the request with redirect_uri_mismatch.
 */
import * as AuthSession from 'expo-auth-session';
import * as Crypto from 'expo-crypto';

import { env } from '@/config/env';
import { GoogleSignInCancelledError } from './errors';

const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
};

export async function signInWithGoogleWeb(): Promise<string> {
  const request = new AuthSession.AuthRequest({
    clientId: env.googleClientIdWeb,
    scopes: ['openid', 'profile', 'email'],
    redirectUri: AuthSession.makeRedirectUri(),
    responseType: AuthSession.ResponseType.IdToken,
    // PKCE (code_challenge/code_challenge_method) is only valid for the
    // authorization-code flow — expo-auth-session enables it by default
    // regardless of responseType, and Google rejects it here with
    // "Parameter not allowed for this message type: code_challenge_method".
    usePKCE: false,
    // Google requires a nonce on the implicit id_token flow to guard
    // against token replay.
    extraParams: { nonce: Crypto.randomUUID() },
  });

  const result = await request.promptAsync(discovery);

  if (result.type === 'cancel' || result.type === 'dismiss') {
    throw new GoogleSignInCancelledError();
  }
  if (result.type !== 'success') {
    throw new Error(`Google sign-in failed: ${result.type}`);
  }

  const idToken = result.params.id_token;
  if (!idToken) {
    throw new Error(
      'Google did not return an ID token — check the Web client’s authorized redirect URIs'
    );
  }

  return idToken;
}
