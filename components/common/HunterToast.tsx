import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { triggerHaptic } from '@/services/audio/hapticsService';
import { fontFamilies } from '@/theme/typography';

export type HunterToastType = 'error' | 'warning' | 'info' | 'success';

export interface HunterToastProps {
  visible: boolean;
  message: string;
  type?: HunterToastType;
  duration?: number;
  onHide?: () => void;
}

export function HunterToast({
  visible,
  message,
  type = 'error',
  duration = 2600,
  onHide,
}: HunterToastProps) {
  const anim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (visible && message) {
      if (timerRef.current) clearTimeout(timerRef.current);

      if (type === 'error') {
        triggerHaptic.notification(Haptics.NotificationFeedbackType.Error);
      } else if (type === 'success') {
        triggerHaptic.notification(Haptics.NotificationFeedbackType.Success);
      } else {
        triggerHaptic.impact(Haptics.ImpactFeedbackStyle.Light);
      }

      Animated.spring(anim, {
        toValue: 1,
        friction: 8,
        tension: 60,
        useNativeDriver: true,
      }).start();

      timerRef.current = setTimeout(() => {
        Animated.timing(anim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start(() => {
          onHide?.();
        });
      }, duration);

      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    } else {
      Animated.timing(anim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, message, type, duration, onHide, anim]);

  if (!visible && !message) return null;

  const iconName =
    type === 'error'
      ? 'alert-circle'
      : type === 'warning'
      ? 'alert-circle'
      : type === 'success'
      ? 'checkmark-circle'
      : 'information-circle';

  const iconColor =
    type === 'error'
      ? '#EF4444'
      : type === 'warning'
      ? '#F59E0B'
      : type === 'success'
      ? '#22C55E'
      : '#FE5B01';

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        {
          opacity: anim,
          transform: [
            {
              translateY: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [24, 0],
              }),
            },
          ],
        },
      ]}
      pointerEvents="none"
    >
      <View style={styles.toastContent}>
        <Ionicons name={iconName} size={18} color={iconColor} style={{ marginRight: 8 }} />
        <Text style={styles.toastText} numberOfLines={2}>
          {message}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    bottom: 34,
    left: 20,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E24',
    borderWidth: 1,
    borderColor: '#33333E',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
    maxWidth: '92%',
  },
  toastText: {
    fontFamily: fontFamilies.medium,
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
