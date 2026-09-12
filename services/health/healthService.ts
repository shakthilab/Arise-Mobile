import { Platform } from 'react-native';
import type { HealthAdapter } from './HealthAdapter';
import { AppleHealthAdapter } from './AppleHealthAdapter';
import { HealthConnectAdapter } from './HealthConnectAdapter';

class DummyHealthAdapter implements HealthAdapter {
  async isAvailable() { return false; }
  async requestPermissions() { return false; }
  async checkPermissions() { return false; }
  async getTodaySummary() {
    const todayStr = new Date().toISOString().split('T')[0];
    return {
      date: todayStr,
      steps: 0,
      calories: 0,
      distanceKm: 0,
      activeMinutes: 0,
      heartRate: 0,
      sleepMinutes: 0,
      workoutCount: 0,
    };
  }
  async getYesterdaySummary() {
    const now = new Date();
    const yesterdayStr = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toISOString().split('T')[0];
    return {
      date: yesterdayStr,
      steps: 0,
      calories: 0,
      distanceKm: 0,
      activeMinutes: 0,
      heartRate: 0,
      sleepMinutes: 0,
      workoutCount: 0,
    };
  }
  async getWeekBarSamples() {
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return dayNames.map((d) => ({
      day: d,
      label: d,
      value: 0,
      steps: 0,
    }));
  }
}

export const appleHealthAdapter = new AppleHealthAdapter();
export const healthConnectAdapter = new HealthConnectAdapter();

export function getAdapterForProvider(provider: 'apple_health' | 'health_connect'): HealthAdapter {
  if (provider === 'apple_health') {
    return appleHealthAdapter;
  }
  if (provider === 'health_connect') {
    return healthConnectAdapter;
  }
  return new DummyHealthAdapter();
}

export function createHealthAdapter(): HealthAdapter {
  if (Platform.OS === 'ios') {
    return appleHealthAdapter;
  } else if (Platform.OS === 'android') {
    return healthConnectAdapter;
  }
  return new DummyHealthAdapter();
}

export const healthService = createHealthAdapter();

