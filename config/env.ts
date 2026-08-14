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
  apiUrl: process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.7:5000/api',
} as const;
