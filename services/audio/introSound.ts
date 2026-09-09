import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { CLOUDINARY_ASSETS } from '@/constants/cloudinaryAssets';
import { useSettingsStore } from '@/store/useSettingsStore';

let globalIntroSound: Audio.Sound | null = null;
let hapticTimers: any[] = [];
let isPreloading = false;

export function clearIntroHaptics(): void {
  hapticTimers.forEach((timer) => clearTimeout(timer));
  hapticTimers = [];
}

export function triggerIntroHaptics(): void {
  clearIntroHaptics();
  if (!useSettingsStore.getState().hapticsEnabled) return;

  // 1. Initial surge strike (0ms)
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});

  // 2. Waveform-synchronized rhythmic pulses matching the intro swell
  const sequence: { delay: number; style: Haptics.ImpactFeedbackStyle }[] = [
    { delay: 90, style: Haptics.ImpactFeedbackStyle.Medium },
    { delay: 300, style: Haptics.ImpactFeedbackStyle.Heavy },
    { delay: 550, style: Haptics.ImpactFeedbackStyle.Medium },
    { delay: 850, style: Haptics.ImpactFeedbackStyle.Light },
    { delay: 1200, style: Haptics.ImpactFeedbackStyle.Light },
  ];

  sequence.forEach(({ delay, style }) => {
    const timer = setTimeout(() => {
      if (useSettingsStore.getState().hapticsEnabled) {
        Haptics.impactAsync(style).catch(() => {});
      }
    }, delay);
    hapticTimers.push(timer);
  });
}

/**
 * Preload intro sound into memory for zero-delay instant playback
 */
export async function preloadIntroAudio(): Promise<void> {
  if (globalIntroSound || isPreloading) return;
  isPreloading = true;

  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    }).catch(() => {});

    const { sound } = await Audio.Sound.createAsync(
      require('@/assets/sounds/intro.mp3'),
      { shouldPlay: false, volume: 1.0 }
    );
    globalIntroSound = sound;
  } catch (err) {
    console.log('Error preloading intro audio:', err);
  } finally {
    isPreloading = false;
  }
}

export async function playIntroAudio(withHaptics: boolean = true): Promise<Audio.Sound | null> {
  const { soundEffectsEnabled, hapticsEnabled } = useSettingsStore.getState();
  if (!soundEffectsEnabled && !hapticsEnabled) return null;

  try {
    if (withHaptics && hapticsEnabled) {
      triggerIntroHaptics();
    }

    if (!soundEffectsEnabled) return null;

    if (globalIntroSound) {
      const status = await globalIntroSound.getStatusAsync();
      if (status.isLoaded) {
        await globalIntroSound.setPositionAsync(0).catch(() => {});
        await globalIntroSound.playAsync().catch(() => {});
        return globalIntroSound;
      }
    }

    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    }).catch(() => {});

    const { sound } = await Audio.Sound.createAsync(
      require('@/assets/sounds/intro.mp3'),
      { shouldPlay: true, volume: 1.0 }
    );

    globalIntroSound = sound;

    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync().catch(() => {});
        clearIntroHaptics();
        if (globalIntroSound === sound) {
          globalIntroSound = null;
        }
      }
    });

    return sound;
  } catch (err) {
    console.log('Error playing intro audio:', err);
    return null;
  }
}

export async function stopIntroAudio(): Promise<void> {
  try {
    clearIntroHaptics();
    if (globalIntroSound) {
      await globalIntroSound.stopAsync().catch(() => {});
      await globalIntroSound.unloadAsync().catch(() => {});
      globalIntroSound = null;
    }
  } catch (err) {
    console.log('Error stopping intro audio:', err);
  }
}
