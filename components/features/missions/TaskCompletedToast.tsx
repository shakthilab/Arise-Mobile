import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { fontFamilies } from '@/theme/typography';

export interface TaskCompletedToastProps {
  visible: boolean;
  xp?: number;
  title?: string;
  subtitle?: string;
  onDismiss?: () => void;
  isError?: boolean;
}

export function TaskCompletedToast({
  visible,
  xp = 10,
  title = 'Task Completed!',
  subtitle = 'Great job, hunter!',
  onDismiss,
  isError = false,
}: TaskCompletedToastProps) {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        handleDismiss();
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      translateY.setValue(-100);
      opacity.setValue(0);
    }
  }, [visible]);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss?.();
    });
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handleDismiss}
        style={styles.card}
      >
        {/* Icon Circle (Green Check or Red Alert) */}
        <View style={[styles.iconCircle, isError && styles.iconCircleError]}>
          <Ionicons name={isError ? 'alert' : 'checkmark'} size={18} color="#FFFFFF" />
        </View>

        {/* Text Details */}
        <View style={styles.textContainer}>
          <Text style={styles.titleText}>{title}</Text>
          <Text style={styles.subtitleText}>{subtitle}</Text>
        </View>

        {/* XP Reward & Sparkle (Only if not error) */}
        {!isError && (
          <View style={styles.xpContainer}>
            <Text style={styles.xpText}>+{xp} XP</Text>
            <View style={styles.sparkleWrapper}>
              <Ionicons name="sparkles" size={14} color="#EA580C" />
            </View>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 54,
    left: 16,
    right: 16,
    zIndex: 9999,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: '#18181B',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#27272A',
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#15803D',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#22C55E',
  },
  iconCircleError: {
    backgroundColor: '#991B1B',
    borderColor: '#EF4444',
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  titleText: {
    fontFamily: fontFamilies.bold,
    fontSize: 15,
    color: '#FFFFFF',
  },
  subtitleText: {
    fontFamily: fontFamilies.medium,
    fontSize: 12,
    color: '#A1A1AA',
    marginTop: 1,
  },
  xpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  xpText: {
    fontFamily: fontFamilies.bold,
    fontSize: 15,
    color: '#EA580C',
  },
  sparkleWrapper: {
    marginLeft: 2,
  },
});
