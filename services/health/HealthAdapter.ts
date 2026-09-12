export interface DailyHealthSummary {
  date: string; // YYYY-MM-DD
  steps: number;
  calories: number; // Active calories (kcal)
  distanceKm: number;
  activeMinutes: number;
  heartRate: number; // avg or latest bpm
  sleepMinutes: number;
  workoutCount: number;
}

export interface DayBarSample {
  day: string; // 'Mon', 'Tue', etc.
  label: string;
  value: number; // e.g. step count or percentage 0-100
  steps: number;
  isCurrent?: boolean;
}

export interface HealthAdapter {
  isAvailable(): Promise<boolean>;
  requestPermissions(): Promise<boolean>;
  /**
   * Silently checks whether previously-granted permissions are still in
   * effect, without prompting the user. On Health Connect (Android) this is a
   * real, current answer. On HealthKit (iOS) Apple does not expose read-permission
   * status by design, so this can't reliably distinguish "denied" from "no
   * data" — callers should not treat a `true` result on iOS as proof of access.
   */
  checkPermissions(): Promise<boolean>;
  getTodaySummary(): Promise<DailyHealthSummary>;
  getWeekBarSamples(): Promise<DayBarSample[]>;
  getYesterdaySummary(): Promise<DailyHealthSummary>;
}
