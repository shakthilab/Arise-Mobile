import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_STORAGE_KEY = 'hunterx-user-settings-v1';

export interface SettingsState {
  soundEffectsEnabled: boolean;
  hapticsEnabled: boolean;
  unitSystem: 'metric' | 'imperial';
  allNotificationsEnabled: boolean;
  dailyMotivationEnabled: boolean;
  taskRemindersEnabled: boolean;
  streakAtRiskEnabled: boolean;
  streakMilestonesEnabled: boolean;
  streakStatusAlertsEnabled: boolean;
  levelUpAlertsEnabled: boolean;
  rewardReadyAlertsEnabled: boolean;
  announcementsEnabled: boolean;

  setSoundEffectsEnabled: (enabled: boolean) => void;
  setHapticsEnabled: (enabled: boolean) => void;
  setUnitSystem: (system: 'metric' | 'imperial') => void;
  setAllNotificationsEnabled: (enabled: boolean) => void;
  setDailyMotivationEnabled: (enabled: boolean) => void;
  setTaskRemindersEnabled: (enabled: boolean) => void;
  setStreakAtRiskEnabled: (enabled: boolean) => void;
  setStreakMilestonesEnabled: (enabled: boolean) => void;
  setStreakStatusAlertsEnabled: (enabled: boolean) => void;
  setLevelUpAlertsEnabled: (enabled: boolean) => void;
  setRewardReadyAlertsEnabled: (enabled: boolean) => void;
  setAnnouncementsEnabled: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>((set, get) => {
  // Load saved settings from AsyncStorage on store initialization
  AsyncStorage.getItem(SETTINGS_STORAGE_KEY)
    .then((json) => {
      if (json) {
        try {
          const parsed = JSON.parse(json);
          set({ ...parsed });
        } catch (_) {}
      }
    })
    .catch(() => {});

  const saveSettings = (partial: Partial<SettingsState>) => {
    set(partial as any);
    try {
      const state = get();
      const payload = {
        soundEffectsEnabled: state.soundEffectsEnabled,
        hapticsEnabled: state.hapticsEnabled,
        unitSystem: state.unitSystem,
        allNotificationsEnabled: state.allNotificationsEnabled,
        dailyMotivationEnabled: state.dailyMotivationEnabled,
        taskRemindersEnabled: state.taskRemindersEnabled,
        streakAtRiskEnabled: state.streakAtRiskEnabled,
        streakMilestonesEnabled: state.streakMilestonesEnabled,
        streakStatusAlertsEnabled: state.streakStatusAlertsEnabled,
        levelUpAlertsEnabled: state.levelUpAlertsEnabled,
        rewardReadyAlertsEnabled: state.rewardReadyAlertsEnabled,
        announcementsEnabled: state.announcementsEnabled,
      };
      AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(payload)).catch(() => {});
    } catch (_) {}
  };

  return {
    soundEffectsEnabled: true,
    hapticsEnabled: true,
    unitSystem: 'metric',
    allNotificationsEnabled: true,
    dailyMotivationEnabled: true,
    taskRemindersEnabled: true,
    streakAtRiskEnabled: true,
    streakMilestonesEnabled: true,
    streakStatusAlertsEnabled: true,
    levelUpAlertsEnabled: true,
    rewardReadyAlertsEnabled: true,
    announcementsEnabled: true,

    setSoundEffectsEnabled: (enabled) => saveSettings({ soundEffectsEnabled: enabled }),
    setHapticsEnabled: (enabled) => saveSettings({ hapticsEnabled: enabled }),
    setUnitSystem: (system) => saveSettings({ unitSystem: system }),
    setAllNotificationsEnabled: (enabled) => saveSettings({ allNotificationsEnabled: enabled }),
    setDailyMotivationEnabled: (enabled) => saveSettings({ dailyMotivationEnabled: enabled }),
    setTaskRemindersEnabled: (enabled) => saveSettings({ taskRemindersEnabled: enabled }),
    setStreakAtRiskEnabled: (enabled) => saveSettings({ streakAtRiskEnabled: enabled }),
    setStreakMilestonesEnabled: (enabled) => saveSettings({ streakMilestonesEnabled: enabled }),
    setStreakStatusAlertsEnabled: (enabled) => saveSettings({ streakStatusAlertsEnabled: enabled }),
    setLevelUpAlertsEnabled: (enabled) => saveSettings({ levelUpAlertsEnabled: enabled }),
    setRewardReadyAlertsEnabled: (enabled) => saveSettings({ rewardReadyAlertsEnabled: enabled }),
    setAnnouncementsEnabled: (enabled) => saveSettings({ announcementsEnabled: enabled }),
  };
});
