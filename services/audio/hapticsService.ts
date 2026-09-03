import * as Haptics from 'expo-haptics';
import { useSettingsStore } from '@/store/useSettingsStore';

export const triggerHaptic = {
  impact: (style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Medium) => {
    if (useSettingsStore.getState().hapticsEnabled) {
      Haptics.impactAsync(style).catch(() => {});
    }
  },
  notification: (type: Haptics.NotificationFeedbackType = Haptics.NotificationFeedbackType.Success) => {
    if (useSettingsStore.getState().hapticsEnabled) {
      Haptics.notificationAsync(type).catch(() => {});
    }
  },
  selection: () => {
    if (useSettingsStore.getState().hapticsEnabled) {
      Haptics.selectionAsync().catch(() => {});
    }
  },
};
