import { Platform } from 'react-native';

export type SoundType = 'tap' | 'select' | 'ascension';

class SoundManager {
  private isMuted: boolean = false;

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Safely play a sound effect without affecting application state or throwing runtime errors.
   */
  public async play(type: SoundType) {
    if (this.isMuted) return;

    try {
      if (Platform.OS === 'web') {
        this.playWebSound(type);
      } else {
        const { createAudioPlayer } = require('expo-audio');
        let source;
        if (type === 'tap') source = require('@/assets/sounds/tap.wav');
        else if (type === 'select') source = require('@/assets/sounds/select.wav');
        else if (type === 'ascension') source = require('@/assets/sounds/ascension.wav');

        if (source) {
          const player = createAudioPlayer(source);
          player.play();
        }
      }
    } catch (err) {
      // Silent error handler ensures no application logic or UI is impacted if audio fails
      console.debug('[SoundManager] Audio play fallback:', err);
    }
  }

  private playWebSound(type: SoundType) {
    try {
      let source;
      if (type === 'tap') source = require('@/assets/sounds/tap.wav');
      else if (type === 'select') source = require('@/assets/sounds/select.wav');
      else if (type === 'ascension') source = require('@/assets/sounds/ascension.wav');

      if (source) {
        const audio = new Audio(source);
        audio.volume = 0.5;
        audio.play().catch(() => {});
      }
    } catch (e) {
      // Silent catch for web audio failure
    }
  }
}

export const soundManager = new SoundManager();
