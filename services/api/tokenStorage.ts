import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

/**
 * Backend-issued JWT/refresh token pair only — small strings, safe for
 * SecureStore's per-key size limit. The Supabase client keeps its own
 * session cache separately (see services/supabase/client.ts).
 *
 * expo-secure-store has no web implementation and throws if called there,
 * so web falls back to localStorage — no Keychain/Keystore equivalent
 * exists in a browser anyway, so this isn't a security downgrade so much
 * as matching what the platform can actually provide.
 */
const ACCESS_TOKEN_KEY = 'hunterx.accessToken';
const REFRESH_TOKEN_KEY = 'hunterx.refreshToken';

const webStorage = {
  async getItem(key: string) {
    return globalThis.localStorage?.getItem(key) ?? null;
  },
  async setItem(key: string, value: string) {
    globalThis.localStorage?.setItem(key, value);
  },
  async deleteItem(key: string) {
    globalThis.localStorage?.removeItem(key);
  },
};

const nativeStorage = {
  getItem: SecureStore.getItemAsync,
  setItem: SecureStore.setItemAsync,
  deleteItem: SecureStore.deleteItemAsync,
};

const storage = Platform.OS === 'web' ? webStorage : nativeStorage;

export const tokenStorage = {
  async getAccessToken() {
    return storage.getItem(ACCESS_TOKEN_KEY);
  },
  async getRefreshToken() {
    return storage.getItem(REFRESH_TOKEN_KEY);
  },
  async setTokens(accessToken: string, refreshToken: string) {
    await storage.setItem(ACCESS_TOKEN_KEY, accessToken);
    await storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },
  async clearTokens() {
    await storage.deleteItem(ACCESS_TOKEN_KEY);
    await storage.deleteItem(REFRESH_TOKEN_KEY);
  },
};
