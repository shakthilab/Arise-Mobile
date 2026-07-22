/**
 * Platform-specific Apple Health / Google Fit implementations must satisfy
 * this interface so screens never branch on Platform.OS themselves.
 * Phase 2 — not wired up yet.
 */
export type HealthSample = {
  type: 'steps' | 'activeMinutes' | 'workout';
  value: number;
  recordedAt: string;
};

export interface HealthAdapter {
  isAvailable(): Promise<boolean>;
  requestPermissions(): Promise<boolean>;
  getTodaySamples(): Promise<HealthSample[]>;
}
