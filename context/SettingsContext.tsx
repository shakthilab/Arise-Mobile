import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSettingsStore } from '@/store/useSettingsStore';

const LOCAL_SETTINGS_KEY = 'hunterx-local-device-settings-v1';

export type ThemeMode = 'dark' | 'light' | 'system';

export interface LocalDeviceSettings {
  themeMode: ThemeMode;
  soundEffectsEnabled: boolean;
  hapticsEnabled: boolean;
}

export interface SettingsContextType extends LocalDeviceSettings {
  isLoaded: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  setSoundEffectsEnabled: (enabled: boolean) => void;
  setHapticsEnabled: (enabled: boolean) => void;
}

const DEFAULT_LOCAL_SETTINGS: LocalDeviceSettings = {
  themeMode: 'dark',
  soundEffectsEnabled: true,
  hapticsEnabled: true,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<LocalDeviceSettings>(DEFAULT_LOCAL_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(LOCAL_SETTINGS_KEY)
      .then((json) => {
        if (json) {
          try {
            const parsed = JSON.parse(json);
            const loadedSettings = {
              themeMode: parsed.themeMode || 'dark',
              soundEffectsEnabled: parsed.soundEffectsEnabled ?? true,
              hapticsEnabled: parsed.hapticsEnabled ?? true,
            };
            setSettings(loadedSettings);
            // Sync with useSettingsStore state so global audio/haptics functions see it immediately
            useSettingsStore.setState({
              soundEffectsEnabled: loadedSettings.soundEffectsEnabled,
              hapticsEnabled: loadedSettings.hapticsEnabled,
            });
          } catch (e) {
            console.warn('[SettingsContext] Failed to parse local settings:', e);
          }
        }
      })
      .catch((err) => {
        console.warn('[SettingsContext] Failed to load local settings from AsyncStorage:', err);
      })
      .finally(() => {
        setIsLoaded(true);
      });
  }, []);

  const updateSetting = <K extends keyof LocalDeviceSettings>(key: K, value: LocalDeviceSettings[K]) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      AsyncStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(next)).catch((err) => {
        console.warn('[SettingsContext] Failed to save local setting to AsyncStorage:', err);
      });
      // Sync global store for non-React callers like taskDoneSound and triggerHaptic
      if (key === 'soundEffectsEnabled') {
        useSettingsStore.setState({ soundEffectsEnabled: value as boolean });
      }
      if (key === 'hapticsEnabled') {
        useSettingsStore.setState({ hapticsEnabled: value as boolean });
      }
      return next;
    });
  };

  const setThemeMode = (mode: ThemeMode) => updateSetting('themeMode', mode);
  const setSoundEffectsEnabled = (enabled: boolean) => updateSetting('soundEffectsEnabled', enabled);
  const setHapticsEnabled = (enabled: boolean) => updateSetting('hapticsEnabled', enabled);

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        isLoaded,
        setThemeMode,
        setSoundEffectsEnabled,
        setHapticsEnabled,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettingsContext(): SettingsContextType {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettingsContext must be used within a SettingsProvider');
  }
  return context;
}
