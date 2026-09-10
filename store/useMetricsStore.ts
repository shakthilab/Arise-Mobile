import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HEALTH_STORAGE_KEY = '@hunterx_health_sync_state';

export type TimeRange = 'Today' | 'Week' | 'Month' | 'Year';

export interface MetricDetail {
  value: string;
  unit: string;
  trend: string;
  trendDirection: 'up' | 'down' | 'neutral';
  target?: string;
  progress?: number; // 0 to 1
}

export interface MetricsDataset {
  steps: {
    current: number;
    target: number;
    percentage: number;
  };
  calories: MetricDetail;
  distance: MetricDetail;
  activeMinutes: MetricDetail;
  heartRate: MetricDetail;
  sleep: MetricDetail;
  workouts: MetricDetail;
  weeklyActivity: {
    avgSteps: string;
    days: {
      day: string;
      label: string;
      value: number; // e.g. 0-100% or step count
      isCurrent?: boolean;
    }[];
  };
}

export interface MetricsState {
  timeRange: TimeRange;
  isHealthConnected: boolean;
  connectedProvider: 'apple_health' | 'health_connect' | null;
  lastSyncedText: string;
  isSyncing: boolean;
  isLoaded: boolean;

  // Datasets per time range
  datasets: Record<TimeRange, MetricsDataset>;

  setTimeRange: (range: TimeRange) => void;
  connectProvider: (provider: 'apple_health' | 'health_connect') => Promise<void>;
  disconnectProvider: () => void;
  syncNow: () => Promise<void>;
  initFromStorage: () => Promise<void>;
}

const DEFAULT_DATASETS: Record<TimeRange, MetricsDataset> = {
  Today: {
    steps: {
      current: 8426,
      target: 12000,
      percentage: 70,
    },
    calories: {
      value: '542',
      unit: 'kcal',
      trend: '12% vs yesterday',
      trendDirection: 'up',
    },
    distance: {
      value: '6.8',
      unit: 'km',
      trend: '8% vs yesterday',
      trendDirection: 'up',
    },
    activeMinutes: {
      value: '56',
      unit: 'min',
      trend: '20% vs yesterday',
      trendDirection: 'up',
    },
    heartRate: {
      value: '72',
      unit: 'bpm',
      trend: '0% vs yesterday',
      trendDirection: 'neutral',
    },
    sleep: {
      value: '7h 24m',
      unit: '',
      trend: '14% vs yesterday',
      trendDirection: 'up',
    },
    workouts: {
      value: '1',
      unit: 'session',
      trend: '1 vs yesterday',
      trendDirection: 'up',
    },
    weeklyActivity: {
      avgSteps: '8,426',
      days: [
        { day: 'Mon', label: 'Mon', value: 45 },
        { day: 'Tue', label: 'Tue', value: 85 },
        { day: 'Wed', label: 'Wed', value: 30 },
        { day: 'Thu', label: 'Thu', value: 92, isCurrent: true },
        { day: 'Fri', label: 'Fri', value: 100 },
        { day: 'Sat', label: 'Sat', value: 55 },
        { day: 'Sun', label: 'Sun', value: 68 },
      ],
    },
  },
  Week: {
    steps: {
      current: 58980,
      target: 84000,
      percentage: 72,
    },
    calories: {
      value: '3,794',
      unit: 'kcal',
      trend: '9% vs last week',
      trendDirection: 'up',
    },
    distance: {
      value: '47.6',
      unit: 'km',
      trend: '11% vs last week',
      trendDirection: 'up',
    },
    activeMinutes: {
      value: '392',
      unit: 'min',
      trend: '15% vs last week',
      trendDirection: 'up',
    },
    heartRate: {
      value: '71',
      unit: 'bpm avg',
      trend: '2% vs last week',
      trendDirection: 'neutral',
    },
    sleep: {
      value: '7h 38m',
      unit: 'avg',
      trend: '6% vs last week',
      trendDirection: 'up',
    },
    workouts: {
      value: '5',
      unit: 'sessions',
      trend: '2 vs last week',
      trendDirection: 'up',
    },
    weeklyActivity: {
      avgSteps: '8,426',
      days: [
        { day: 'Mon', label: 'Mon', value: 70 },
        { day: 'Tue', label: 'Tue', value: 85 },
        { day: 'Wed', label: 'Wed', value: 60 },
        { day: 'Thu', label: 'Thu', value: 95, isCurrent: true },
        { day: 'Fri', label: 'Fri', value: 100 },
        { day: 'Sat', label: 'Sat', value: 80 },
        { day: 'Sun', label: 'Sun', value: 75 },
      ],
    },
  },
  Month: {
    steps: {
      current: 252780,
      target: 360000,
      percentage: 74,
    },
    calories: {
      value: '16,260',
      unit: 'kcal',
      trend: '14% vs last month',
      trendDirection: 'up',
    },
    distance: {
      value: '204.2',
      unit: 'km',
      trend: '10% vs last month',
      trendDirection: 'up',
    },
    activeMinutes: {
      value: '1,680',
      unit: 'min',
      trend: '18% vs last month',
      trendDirection: 'up',
    },
    heartRate: {
      value: '70',
      unit: 'bpm avg',
      trend: '1% vs last month',
      trendDirection: 'neutral',
    },
    sleep: {
      value: '7h 30m',
      unit: 'avg',
      trend: '8% vs last month',
      trendDirection: 'up',
    },
    workouts: {
      value: '22',
      unit: 'sessions',
      trend: '4 vs last month',
      trendDirection: 'up',
    },
    weeklyActivity: {
      avgSteps: '8,426',
      days: [
        { day: 'W1', label: 'W1', value: 80 },
        { day: 'W2', label: 'W2', value: 90 },
        { day: 'W3', label: 'W3', value: 75 },
        { day: 'W4', label: 'W4', value: 95, isCurrent: true },
      ],
    },
  },
  Year: {
    steps: {
      current: 3086400,
      target: 4380000,
      percentage: 70,
    },
    calories: {
      value: '198,400',
      unit: 'kcal',
      trend: '22% vs last year',
      trendDirection: 'up',
    },
    distance: {
      value: '2,490',
      unit: 'km',
      trend: '16% vs last year',
      trendDirection: 'up',
    },
    activeMinutes: {
      value: '20,440',
      unit: 'min',
      trend: '25% vs last year',
      trendDirection: 'up',
    },
    heartRate: {
      value: '69',
      unit: 'bpm avg',
      trend: '3% vs last year',
      trendDirection: 'neutral',
    },
    sleep: {
      value: '7h 35m',
      unit: 'avg',
      trend: '5% vs last year',
      trendDirection: 'up',
    },
    workouts: {
      value: '264',
      unit: 'sessions',
      trend: '38 vs last year',
      trendDirection: 'up',
    },
    weeklyActivity: {
      avgSteps: '8,426',
      days: [
        { day: 'Q1', label: 'Q1', value: 75 },
        { day: 'Q2', label: 'Q2', value: 88 },
        { day: 'Q3', label: 'Q3', value: 92, isCurrent: true },
        { day: 'Q4', label: 'Q4', value: 80 },
      ],
    },
  },
};

export const useMetricsStore = create<MetricsState>((set, get) => {
  // Try loading initial state from storage
  AsyncStorage.getItem(HEALTH_STORAGE_KEY)
    .then((json) => {
      if (json) {
        try {
          const parsed = JSON.parse(json);
          set({
            isHealthConnected: !!parsed.isHealthConnected,
            connectedProvider: parsed.connectedProvider || null,
            lastSyncedText: parsed.lastSyncedText || 'Today, 9:40 AM',
            isLoaded: true,
          });
          return;
        } catch (_) {}
      }
      set({ isLoaded: true });
    })
    .catch(() => {
      set({ isLoaded: true });
    });

  return {
    timeRange: 'Today',
    // Default to false so user sees the "Connect Your Health Data" screen first!
    isHealthConnected: false,
    connectedProvider: null,
    lastSyncedText: 'Not connected',
    isSyncing: false,
    isLoaded: false,
    datasets: DEFAULT_DATASETS,

    setTimeRange: (range: TimeRange) => {
      set({ timeRange: range });
    },

    initFromStorage: async () => {
      try {
        const json = await AsyncStorage.getItem(HEALTH_STORAGE_KEY);
        if (json) {
          const parsed = JSON.parse(json);
          set({
            isHealthConnected: !!parsed.isHealthConnected,
            connectedProvider: parsed.connectedProvider || null,
            lastSyncedText: parsed.lastSyncedText || 'Today, 9:40 AM',
            isLoaded: true,
          });
        } else {
          set({ isLoaded: true });
        }
      } catch (_) {
        set({ isLoaded: true });
      }
    },

    connectProvider: async (provider: 'apple_health' | 'health_connect') => {
      set({ isSyncing: true });
      await new Promise((resolve) => setTimeout(resolve, 800));
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newState = {
        isHealthConnected: true,
        connectedProvider: provider,
        lastSyncedText: `Today, ${timeString}`,
        isSyncing: false,
      };
      set(newState);
      AsyncStorage.setItem(HEALTH_STORAGE_KEY, JSON.stringify(newState)).catch(() => {});
    },

    disconnectProvider: () => {
      const newState = {
        isHealthConnected: false,
        connectedProvider: null,
        lastSyncedText: 'Not connected',
      };
      set(newState);
      AsyncStorage.setItem(HEALTH_STORAGE_KEY, JSON.stringify(newState)).catch(() => {});
    },

    syncNow: async () => {
      set({ isSyncing: true });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newState = {
        lastSyncedText: `Today, ${timeString}`,
        isSyncing: false,
      };
      set(newState);
      AsyncStorage.setItem(
        HEALTH_STORAGE_KEY,
        JSON.stringify({
          isHealthConnected: get().isHealthConnected,
          connectedProvider: get().connectedProvider,
          lastSyncedText: newState.lastSyncedText,
        })
      ).catch(() => {});
    },
  };
});
