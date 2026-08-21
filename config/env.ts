function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    if (__DEV__) {
      console.warn(`[config/env] Missing ${name} — set it in .env (see .env.example)`);
    }
    return '';
  }
  return value;
}

export const env = {
  supabaseUrl: requireEnv(
    'EXPO_PUBLIC_SUPABASE_URL',
    process.env.EXPO_PUBLIC_SUPABASE_URL
  ),
  supabaseAnonKey: requireEnv(
    'EXPO_PUBLIC_SUPABASE_ANON_KEY',
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
  ),
  apiUrl: requireEnv('EXPO_PUBLIC_API_URL', process.env.EXPO_PUBLIC_API_URL),
  // Web client ID doubles as the audience Google issues the ID token for on
  // BOTH platforms — the backend verifies against it. iOS client ID overrides
  // the one GoogleService-Info.plist would normally provide (we don't ship one).
  googleClientIdWeb: requireEnv(
    'EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB',
    process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB
  ),
  googleClientIdIos: requireEnv(
    'EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS',
    process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS
  ),
} as const;
