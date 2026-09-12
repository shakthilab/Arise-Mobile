import { Platform } from 'react-native';
import type { HealthAdapter, DailyHealthSummary, DayBarSample } from './HealthAdapter';

let HealthConnect: any = null;

try {
  if (Platform.OS === 'android') {
    HealthConnect = require('react-native-health-connect');
  }
} catch (e) {
  console.warn('[HealthConnectAdapter] Could not import react-native-health-connect:', e);
}

// Shared with checkPermissions() below so the "did we get everything we asked
// for" comparison can never drift from what we actually requested.
const REQUIRED_PERMISSIONS: Array<{ accessType: 'read'; recordType: string }> = [
  { accessType: 'read', recordType: 'Steps' },
  { accessType: 'read', recordType: 'ActiveCaloriesBurned' },
  { accessType: 'read', recordType: 'Distance' },
  { accessType: 'read', recordType: 'HeartRate' },
  { accessType: 'read', recordType: 'SleepSession' },
  { accessType: 'read', recordType: 'ExerciseSession' },
];

export class HealthConnectAdapter implements HealthAdapter {
  private isInitialized = false;

  async isAvailable(): Promise<boolean> {
    console.log('[HealthConnectAdapter] Checking availability... Platform:', Platform.OS, 'HealthConnect module loaded:', !!HealthConnect);
    if (Platform.OS !== 'android') {
      console.log('[HealthConnectAdapter] isAvailable: false (Not Android)');
      return false;
    }
    if (!HealthConnect) {
      console.error('[HealthConnectAdapter] isAvailable: false (react-native-health-connect module failed to load/import)');
      return false;
    }
    try {
      const status = await HealthConnect.getSdkStatus();
      console.log('[HealthConnectAdapter] HealthConnect.getSdkStatus() returned status:', status);
      const isAvailable = status === HealthConnect.SdkAvailabilityStatus.SDK_AVAILABLE;
      console.log('[HealthConnectAdapter] isAvailable:', isAvailable);
      return isAvailable;
    } catch (e: any) {
      console.error('[HealthConnectAdapter] isAvailable error:', e?.message || e, e);
      return false;
    }
  }

  async requestPermissions(): Promise<boolean> {
    console.log('[HealthConnectAdapter] Requesting permissions...');
    if (Platform.OS !== 'android' || !HealthConnect) {
      console.error('[HealthConnectAdapter] requestPermissions failed: Not Android or HealthConnect module missing');
      return false;
    }
    try {
      console.log('[HealthConnectAdapter] Initializing HealthConnect...');
      const isInit = await HealthConnect.initialize();
      console.log('[HealthConnectAdapter] HealthConnect.initialize() result:', isInit);
      if (!isInit) {
        console.error('[HealthConnectAdapter] HealthConnect.initialize() returned false');
        return false;
      }
      this.isInitialized = true;

      console.log('[HealthConnectAdapter] Requesting permissions for:', REQUIRED_PERMISSIONS);
      const res = await HealthConnect.requestPermission(REQUIRED_PERMISSIONS);
      console.log('[HealthConnectAdapter] HealthConnect.requestPermission() response:', res);
      if (Array.isArray(res) && res.length === 0) {
        console.warn('[HealthConnectAdapter] Permissions request returned empty array (user canceled or denied all)');
        return false;
      }
      return true;
    } catch (e: any) {
      console.error('[HealthConnectAdapter] requestPermissions exception:', e?.message || e, e);
      return false;
    }
  }

  // Unlike HealthKit, Health Connect actually exposes real, current grant
  // status via getGrantedPermissions() — no system prompt, no heuristics. This
  // is what lets the store detect a revoked permission on Android and revert
  // to the connect banner instead of silently showing stale/zero data forever.
  async checkPermissions(): Promise<boolean> {
    if (Platform.OS !== 'android' || !HealthConnect) {
      return true;
    }
    try {
      const isInit = await HealthConnect.initialize();
      if (!isInit) {
        return false;
      }
      this.isInitialized = true;

      const granted: Array<{ accessType: string; recordType: string }> =
        await HealthConnect.getGrantedPermissions();
      if (!Array.isArray(granted)) {
        return false;
      }

      return REQUIRED_PERMISSIONS.every((required) =>
        granted.some(
          (g) => g.accessType === required.accessType && g.recordType === required.recordType
        )
      );
    } catch (e) {
      console.warn('[HealthConnectAdapter] checkPermissions failed:', e);
      // Fails open rather than bouncing the user to the connect banner over a
      // transient error (Health Connect not running, momentary IPC failure).
      return true;
    }
  }

  async getTodaySummary(): Promise<DailyHealthSummary> {
    const todayStr = new Date().toISOString().split('T')[0];
    const emptySummary: DailyHealthSummary = {
      date: todayStr,
      steps: 0,
      calories: 0,
      distanceKm: 0,
      activeMinutes: 0,
      heartRate: 0,
      sleepMinutes: 0,
      workoutCount: 0,
    };

    if (Platform.OS !== 'android' || !HealthConnect) {
      return emptySummary;
    }

    try {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const endOfDay = now.toISOString();

      const timeRangeFilter = {
        operator: 'between',
        startTime: startOfDay,
        endTime: endOfDay,
      };

      let steps = 0;
      try {
        const stepRecords = await HealthConnect.readRecords('Steps', { timeRangeFilter });
        if (stepRecords?.records) {
          steps = stepRecords.records.reduce((acc: number, curr: any) => acc + (curr.count || 0), 0);
        }
      } catch (_) {}

      let calories = 0;
      try {
        const calorieRecords = await HealthConnect.readRecords('ActiveCaloriesBurned', { timeRangeFilter });
        if (calorieRecords?.records) {
          calories = Math.round(
            calorieRecords.records.reduce((acc: number, curr: any) => acc + (curr.energy?.inKilocalories || 0), 0)
          );
        }
      } catch (_) {}

      let distanceKm = 0;
      try {
        const distRecords = await HealthConnect.readRecords('Distance', { timeRangeFilter });
        if (distRecords?.records) {
          const totalMeters = distRecords.records.reduce((acc: number, curr: any) => acc + (curr.distance?.inMeters || 0), 0);
          distanceKm = parseFloat((totalMeters / 1000).toFixed(2));
        }
      } catch (_) {}

      let heartRate = 0;
      try {
        const hrRecords = await HealthConnect.readRecords('HeartRate', { timeRangeFilter });
        if (hrRecords?.records?.length > 0) {
          let sumBpm = 0;
          let count = 0;
          hrRecords.records.forEach((rec: any) => {
            if (Array.isArray(rec.samples)) {
              rec.samples.forEach((s: any) => {
                sumBpm += s.beatsPerMinute || 0;
                count++;
              });
            }
          });
          if (count > 0) heartRate = Math.round(sumBpm / count);
        }
      } catch (_) {}

      let sleepMinutes = 0;
      try {
        const yesterdayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 18, 0).toISOString();
        const sleepFilter = { operator: 'between', startTime: yesterdayStart, endTime: endOfDay };
        const sleepRecords = await HealthConnect.readRecords('SleepSession', { timeRangeFilter: sleepFilter });
        if (sleepRecords?.records) {
          let totalMs = 0;
          sleepRecords.records.forEach((rec: any) => {
            if (rec.startTime && rec.endTime) {
              totalMs += new Date(rec.endTime).getTime() - new Date(rec.startTime).getTime();
            }
          });
          sleepMinutes = Math.round(totalMs / (1000 * 60));
        }
      } catch (_) {}

      let workoutCount = 0;
      try {
        const workoutRecords = await HealthConnect.readRecords('ExerciseSession', { timeRangeFilter });
        if (workoutRecords?.records) {
          workoutCount = workoutRecords.records.length;
        }
      } catch (_) {}

      const activeMinutes = Math.min(Math.round(steps / 100) + (workoutCount * 30), 180);

      const summary: DailyHealthSummary = {
        date: todayStr,
        steps,
        calories,
        distanceKm,
        activeMinutes,
        heartRate,
        sleepMinutes,
        workoutCount,
      };

      console.log('----------------------------------------------------');
      console.log('📊 [HealthConnectAdapter] Live Health Summary Read from Android:');
      console.log('   Date:', summary.date);
      console.log('   Steps:', summary.steps);
      console.log('   Calories (kcal):', summary.calories);
      console.log('   Distance (km):', summary.distanceKm);
      console.log('   Heart Rate (bpm):', summary.heartRate);
      console.log('   Sleep (mins):', summary.sleepMinutes);
      console.log('   Active Mins:', summary.activeMinutes);
      console.log('   Workouts:', summary.workoutCount);
      console.log('----------------------------------------------------');

      return summary;
    } catch (e: any) {
      console.warn('[HealthConnectAdapter] getTodaySummary failed:', e);
      return emptySummary;
    }
  }

  async getYesterdaySummary(): Promise<DailyHealthSummary> {
    const now = new Date();
    const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const emptySummary: DailyHealthSummary = {
      date: yesterdayStr,
      steps: 0,
      calories: 0,
      distanceKm: 0,
      activeMinutes: 0,
      heartRate: 0,
      sleepMinutes: 0,
      workoutCount: 0,
    };

    if (Platform.OS !== 'android' || !HealthConnect) {
      return emptySummary;
    }

    try {
      const startOfDay = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 0, 0, 0).toISOString();
      const endOfDay = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59).toISOString();

      const timeRangeFilter = {
        operator: 'between',
        startTime: startOfDay,
        endTime: endOfDay,
      };

      let steps = 0;
      try {
        const stepRecords = await HealthConnect.readRecords('Steps', { timeRangeFilter });
        if (stepRecords?.records) {
          steps = stepRecords.records.reduce((acc: number, curr: any) => acc + (curr.count || 0), 0);
        }
      } catch (_) {}

      let calories = 0;
      try {
        const calorieRecords = await HealthConnect.readRecords('ActiveCaloriesBurned', { timeRangeFilter });
        if (calorieRecords?.records) {
          calories = Math.round(
            calorieRecords.records.reduce((acc: number, curr: any) => acc + (curr.energy?.inKilocalories || 0), 0)
          );
        }
      } catch (_) {}

      let distanceKm = 0;
      try {
        const distRecords = await HealthConnect.readRecords('Distance', { timeRangeFilter });
        if (distRecords?.records) {
          const totalMeters = distRecords.records.reduce((acc: number, curr: any) => acc + (curr.distance?.inMeters || 0), 0);
          distanceKm = parseFloat((totalMeters / 1000).toFixed(2));
        }
      } catch (_) {}

      let heartRate = 0;
      try {
        const hrRecords = await HealthConnect.readRecords('HeartRate', { timeRangeFilter });
        if (hrRecords?.records?.length > 0) {
          let sumBpm = 0;
          let count = 0;
          hrRecords.records.forEach((rec: any) => {
            if (Array.isArray(rec.samples)) {
              rec.samples.forEach((s: any) => {
                sumBpm += s.beatsPerMinute || 0;
                count++;
              });
            }
          });
          if (count > 0) heartRate = Math.round(sumBpm / count);
        }
      } catch (_) {}

      let sleepMinutes = 0;
      try {
        const sleepRecords = await HealthConnect.readRecords('SleepSession', { timeRangeFilter });
        if (sleepRecords?.records) {
          let totalMs = 0;
          sleepRecords.records.forEach((rec: any) => {
            if (rec.startTime && rec.endTime) {
              totalMs += new Date(rec.endTime).getTime() - new Date(rec.startTime).getTime();
            }
          });
          sleepMinutes = Math.round(totalMs / (1000 * 60));
        }
      } catch (_) {}

      let workoutCount = 0;
      try {
        const workoutRecords = await HealthConnect.readRecords('ExerciseSession', { timeRangeFilter });
        if (workoutRecords?.records) {
          workoutCount = workoutRecords.records.length;
        }
      } catch (_) {}

      const activeMinutes = Math.min(Math.round(steps / 100) + (workoutCount * 30), 180);

      return {
        date: yesterdayStr,
        steps,
        calories,
        distanceKm,
        activeMinutes,
        heartRate,
        sleepMinutes,
        workoutCount,
      };
    } catch (e) {
      console.warn('[HealthConnectAdapter] getYesterdaySummary failed:', e);
      return emptySummary;
    }
  }

  async getWeekBarSamples(): Promise<DayBarSample[]> {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();
    const currentDayIdx = now.getDay();

    const mondayOffset = currentDayIdx === 0 ? -6 : 1 - currentDayIdx;
    const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + mondayOffset);

    const weekDays: Array<{ dateStr: string; dayLabel: string; isCurrent: boolean }> = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
      weekDays.push({
        dateStr: d.toISOString().split('T')[0],
        dayLabel: dayNames[d.getDay()],
        isCurrent: d.toDateString() === now.toDateString(),
      });
    }

    const emptyBars: DayBarSample[] = weekDays.map((w) => ({
      day: w.dayLabel,
      label: w.dayLabel,
      value: 0,
      steps: 0,
      isCurrent: w.isCurrent,
    }));

    if (Platform.OS !== 'android' || !HealthConnect) {
      return emptyBars;
    }

    try {
      const startOfWeek = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate(), 0, 0, 0).toISOString();
      const endOfWeek = now.toISOString();

      const stepRecords = await HealthConnect.readRecords('Steps', {
        timeRangeFilter: { operator: 'between', startTime: startOfWeek, endTime: endOfWeek },
      });

      const map: Record<string, number> = {};
      if (stepRecords?.records) {
        stepRecords.records.forEach((rec: any) => {
          if (rec.startTime) {
            const dStr = rec.startTime.split('T')[0];
            map[dStr] = (map[dStr] || 0) + (rec.count || 0);
          }
        });
      }

      const maxTarget = 10000;
      const samples = weekDays.map((w) => {
        const stepVal = map[w.dateStr] || 0;
        const pct = Math.min(Math.round((stepVal / maxTarget) * 100), 100);
        return {
          day: w.dayLabel,
          label: w.dayLabel,
          value: pct,
          steps: stepVal,
          isCurrent: w.isCurrent,
        };
      });

      console.log('----------------------------------------------------');
      console.log('📅 [HealthConnectAdapter] Weekly Steps Read from Health Connect:');
      console.log(`   Time Window: ${startOfWeek} -> ${endOfWeek}`);
      console.log(`   Total Step Records Count: ${stepRecords?.records?.length || 0}`);
      samples.forEach((s, idx) => {
        const dateStr = weekDays[idx].dateStr;
        console.log(`   ${s.day} (${dateStr}): ${s.steps} steps ${s.isCurrent ? '👈 [TODAY]' : ''}`);
      });
      console.log('----------------------------------------------------');

      return samples;
    } catch (e: any) {
      console.warn('[HealthConnectAdapter] getWeekBarSamples failed:', e);
      return emptyBars;
    }
  }
}
