import React, { useRef, useEffect } from 'react';
import { Animated, StyleSheet, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';

import { useSettingsStore } from '@/store/useSettingsStore';

export interface HunterSwitchProps {
  value: boolean;
  onValueChange: (val: boolean) => void;
  disabled?: boolean;
}

export function HunterSwitch({ value, onValueChange, disabled }: HunterSwitchProps) {
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [value, animatedValue]);

  const toggle = () => {
    if (disabled) return;
    if (useSettingsStore.getState().hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    onValueChange(!value);
  };

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 18],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={toggle}
      disabled={disabled}
      style={[
        styles.customSwitchTrack,
        {
          backgroundColor: value ? '#FE5B01' : '#27272A',
          opacity: disabled ? 0.35 : 1,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.customSwitchThumb,
          {
            transform: [{ translateX }],
          },
        ]}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  customSwitchTrack: {
    width: 44,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
  },
  customSwitchThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },
});
