import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { CLOUDINARY_ASSETS } from '@/constants/cloudinaryAssets';

let globalIntroSound: Audio.Sound | null = null;
let hapticTimers: any[] = [];

export function clearIntroHaptics(): void {
  hapticTimers.forEach((timer) => clearTimeout(timer));
  hapticTimers = [];
}

export function triggerIntroHaptics(): void {
  clearIntroHaptics();

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
      Haptics.impactAsync(style).catch(() => {});
    }, delay);
    hapticTimers.push(timer);
  });
}

export async function playIntroAudio(withHaptics: boolean = true): Promise<Audio.Sound | null> {
  try {
    if (globalIntroSound) {
      const status = await globalIntroSound.getStatusAsync();
      if (status.isLoaded && status.isPlaying) {
        if (withHaptics) triggerIntroHaptics();
        return globalIntroSound;
      }
      await globalIntroSound.unloadAsync().catch(() => {});
      globalIntroSound = null;
    }

    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });

    const { sound } = await Audio.Sound.createAsync(
      { uri: CLOUDINARY_ASSETS.intro_audio.uri },
      { shouldPlay: true, volume: 1.0 }
    );

    globalIntroSound = sound;

    // Trigger synchronized haptics at the exact moment playback starts
    if (withHaptics) {
      triggerIntroHaptics();
    }

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
