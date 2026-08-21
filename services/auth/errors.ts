/** Shared across the native and web Google Sign-In implementations so
 * callers can catch cancellation with a single `instanceof` check regardless
 * of platform. */
export class GoogleSignInCancelledError extends Error {
  constructor() {
    super('Google sign-in was cancelled');
    this.name = 'GoogleSignInCancelledError';
  }
}
