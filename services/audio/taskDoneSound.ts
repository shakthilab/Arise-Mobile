import { Audio } from 'expo-av';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

import { useSettingsStore } from '@/store/useSettingsStore';

let taskDoneSound: Audio.Sound | null = null;
let webAudioElement: any = null;
let isPreloading = false;

/**
 * Preload done.wav so that playback has zero decoding delay
 * and triggers instantaneously alongside haptics.
 */
export async function preloadTaskDoneSound(): Promise<void> {
  if (taskDoneSound || webAudioElement || isPreloading) return;
  isPreloading = true;

  try {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        const audioAsset = require('@/assets/sounds/done.wav');
        const src =
          typeof audioAsset === 'string'
            ? audioAsset
            : audioAsset?.default || audioAsset?.uri || audioAsset;
        webAudioElement = new window.Audio(src);
        webAudioElement.preload = 'auto';
        webAudioElement.load();
      } catch (webErr) {
        console.warn('[TaskDoneSound] Web audio preload error:', webErr);
      }
    } else {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      }).catch(() => {});

      const { sound } = await Audio.Sound.createAsync(
        require('@/assets/sounds/done.wav'),
        { shouldPlay: false, volume: 1.0 }
      );
      taskDoneSound = sound;
    }
  } catch (err) {
    console.warn('[TaskDoneSound] Preload error:', err);
  } finally {
    isPreloading = false;
  }
}

/**
 * Plays done.wav with ultra-snappy zero-latency playback
 * tightly coupled with haptic feedback for done, completed, and partial task states.
 */
export async function playTaskDoneSound(
  type: 'done' | 'completed' | 'partial' = 'completed'
): Promise<void> {
  const { soundEffectsEnabled, hapticsEnabled } = useSettingsStore.getState();

  // 1. Ultra snappy immediate haptic feedback (if enabled)
  if (hapticsEnabled) {
    try {
      if (type === 'partial') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      }
    } catch (_) {}
  }

  // 2. Zero-latency sound playback (if enabled)
  if (!soundEffectsEnabled) return;
  try {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        if (!webAudioElement) {
          const audioAsset = require('@/assets/sounds/done.wav');
          const src =
            typeof audioAsset === 'string'
              ? audioAsset
              : audioAsset?.default || audioAsset?.uri || audioAsset;
          webAudioElement = new window.Audio(src);
        }
        webAudioElement.currentTime = 0;
        webAudioElement.volume = 1.0;
        webAudioElement.play().catch(() => {});
        return;
      } catch (webPlayErr) {
        console.warn('[TaskDoneSound] Web play error:', webPlayErr);
      }
    }

    if (taskDoneSound) {
      await taskDoneSound.stopAsync().catch(() => {});
      await taskDoneSound.setPositionAsync(0).catch(() => {});
      await taskDoneSound.playAsync().catch(() => {});
    } else {
      const { sound } = await Audio.Sound.createAsync(
        require('@/assets/sounds/done.wav'),
        { shouldPlay: true, volume: 1.0 }
      );
      taskDoneSound = sound;
    }
  } catch (err) {
    console.warn('[TaskDoneSound] Play error:', err);
  }
}
