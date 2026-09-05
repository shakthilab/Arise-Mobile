import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { fontFamilies } from '@/theme/typography';
import { StreakFireVisual } from './StreakFireVisual';
import type { StreakReminderStage, StreakStageConfig } from './types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface StreakReminderModalProps {
  visible: boolean;
  stage?: StreakReminderStage;
  missedDays?: number;
  streakLost?: boolean;
  onDismiss: () => void;
  onAction?: () => void;
}

export const STAGE_CONFIGS: Record<StreakReminderStage, StreakStageConfig> = {
  active_warning: {
    stage: 'active_warning',
    badgeLabel: 'MISSED A DAY',
    badgeColor: '#FE5B01',
    title: 'Your streak needs you!',
    subtitle: 'Keep going, Hunter.',
    buttonLabel: 'CONTINUE',
    missedDays: 1,
    streakLost: false,
  },
  weak: {
    stage: 'weak',
    badgeLabel: '2 DAYS MISSED',
    badgeColor: '#FF6D00',
    title: 'Your streak is getting weaker.',
    subtitle: 'Come back before you lose it!',
    buttonLabel: 'CONTINUE',
    missedDays: 2,
    streakLost: false,
  },
  lost: {
    stage: 'lost',
    badgeLabel: 'STREAK LOST',
    badgeColor: '#8D432E',
    title: 'Your streak has ended.',
    subtitle: 'Every new streak starts with Day 1.',
    buttonLabel: 'START AGAIN',
    missedDays: 3,
    streakLost: true,
  },
};

export function resolveStreakStage(missedDays: number, streakLost?: boolean): StreakReminderStage {
  if (streakLost || missedDays >= 3) {
    return 'lost';
  }
  if (missedDays === 2) {
    return 'weak';
  }
  return 'active_warning';
}

export function StreakReminderModal({
  visible,
  stage: stageProp,
  missedDays = 1,
  streakLost = false,
  onDismiss,
  onAction,
}: StreakReminderModalProps) {
  const [modalVisible, setModalVisible] = useState(visible);
  const activeStage = stageProp ?? resolveStreakStage(missedDays, streakLost);
  const config = STAGE_CONFIGS[activeStage];

  // Animation values
  const backdropOpacity = useSharedValue(0);
  const cardScale = useSharedValue(0.92);
  const cardOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(1);

  useEffect(() => {
    if (visible) {
      setModalVisible(true);
      // Trigger subtle haptic on presentation
      if (activeStage === 'lost') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }

      // Reset
      backdropOpacity.value = 0;
      cardScale.value = 0.92;
      cardOpacity.value = 0;
      contentOpacity.value = 0;

      // 1. Fade backdrop in
      backdropOpacity.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) });

      // 2. Card scales & fades in smoothly
      cardOpacity.value = withTiming(1, { duration: 350, easing: Easing.out(Easing.quad) });
      cardScale.value = withSpring(1, {
        damping: 18,
        stiffness: 160,
        mass: 0.8,
      });

      // 3. Staggered content reveal
      contentOpacity.value = withDelay(
        200,
        withTiming(1, { duration: 400, easing: Easing.out(Easing.quad) })
      );
    } else {
      // Exit animation
      backdropOpacity.value = withTiming(0, { duration: 250 });
      cardOpacity.value = withTiming(0, { duration: 200 });
      cardScale.value = withTiming(0.94, { duration: 200 }, (finished) => {
        if (finished) {
          runOnJS(setModalVisible)(false);
        }
      });
    }
  }, [visible, activeStage]);

  const handleButtonPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Button micro-press bounce
    buttonScale.value = withSequence(
      withTiming(0.95, { duration: 80 }),
      withTiming(1, { duration: 80 })
    );

    // Smooth exit
    backdropOpacity.value = withTiming(0, { duration: 220 });
    cardOpacity.value = withTiming(0, { duration: 200 });
    cardScale.value = withTiming(0.95, { duration: 200 }, (finished) => {
      if (finished) {
        runOnJS(setModalVisible)(false);
        if (onAction) {
          runOnJS(onAction)();
        } else {
          runOnJS(onDismiss)();
        }
      }
    });
  };

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ scale: cardScale.value }],
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  if (!modalVisible) return null;

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleButtonPress}
    >
      <View style={styles.overlayContainer}>
        {/* BACKDROP */}
        <Animated.View style={[styles.backdrop, backdropAnimatedStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={handleButtonPress} />
        </Animated.View>

        {/* CENTERED COMPACT CARD */}
        <Animated.View style={[styles.cardWrapper, cardAnimatedStyle]}>
          <LinearGradient
            colors={['#18181D', '#0F0F12', '#0A0A0C']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.cardGradient}
          >
            {/* AMBIENT TOP BORDER GLOW */}
            <LinearGradient
              colors={
                activeStage === 'active_warning'
                  ? ['rgba(254, 91, 1, 0.4)', 'rgba(254, 91, 1, 0.05)', 'transparent']
                  : activeStage === 'weak'
                  ? ['rgba(216, 67, 21, 0.3)', 'rgba(216, 67, 21, 0.05)', 'transparent']
                  : ['rgba(141, 67, 46, 0.25)', 'transparent', 'transparent']
              }
              style={styles.cardTopGlow}
            />

            <Animated.View style={[styles.cardContent, contentAnimatedStyle]}>
              {/* 1. STATUS BADGE PILL */}
              <View
                style={[
                  styles.badgePill,
                  {
                    borderColor:
                      activeStage === 'active_warning'
                        ? 'rgba(254, 91, 1, 0.45)'
                        : activeStage === 'weak'
                        ? 'rgba(255, 109, 0, 0.35)'
                        : 'rgba(141, 67, 46, 0.35)',
                    backgroundColor:
                      activeStage === 'active_warning'
                        ? 'rgba(254, 91, 1, 0.12)'
                        : activeStage === 'weak'
                        ? 'rgba(255, 109, 0, 0.1)'
                        : 'rgba(141, 67, 46, 0.1)',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    {
                      color:
                        activeStage === 'active_warning'
                          ? '#FE5B01'
                          : activeStage === 'weak'
                          ? '#FFA000'
                          : '#BCAAA4',
                    },
                  ]}
                >
                  {config.badgeLabel}
                </Text>
              </View>

              {/* 2. TITLE */}
              <Text style={styles.titleText}>{config.title}</Text>

              {/* 3. ANIMATED FLAME ARENA */}
              <View style={styles.flameArena}>
                <StreakFireVisual stage={activeStage} size={180} />
              </View>

              {/* 4. SUBTITLE / HUNTER MOTIVATION */}
              <Text style={styles.subtitleText}>{config.subtitle}</Text>

              {/* 5. ACTION BUTTON */}
              <Animated.View style={[styles.buttonContainer, buttonAnimatedStyle]}>
                <Pressable
                  style={({ pressed }) => [
                    styles.actionButton,
                    activeStage === 'lost'
                      ? styles.actionButtonLost
                      : styles.actionButtonActive,
                    pressed && styles.actionButtonPressed,
                  ]}
                  onPress={handleButtonPress}
                >
                  <Text
                    style={[
                      styles.actionButtonText,
                      activeStage === 'lost'
                        ? styles.actionButtonTextLost
                        : styles.actionButtonTextActive,
                    ]}
                  >
                    {config.buttonLabel}
                  </Text>
                </Pressable>
              </Animated.View>
            </Animated.View>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5, 5, 8, 0.82)',
  },
  cardWrapper: {
    width: Math.min(SCREEN_WIDTH * 0.86, 360),
    borderRadius: 24,
    borderWidth: 1.2,
    borderColor: '#26262E',
    overflow: 'hidden',
    shadowColor: '#FE5B01',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 12,
  },
  cardGradient: {
    paddingTop: 24,
    paddingBottom: 22,
    paddingHorizontal: 20,
    alignItems: 'center',
    position: 'relative',
  },
  cardTopGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 90,
  },
  cardContent: {
    width: '100%',
    alignItems: 'center',
  },
  badgePill: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 12,
  },
  badgeText: {
    fontFamily: fontFamilies.bold,
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  titleText: {
    fontFamily: fontFamilies.bold,
    fontSize: 20,
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0.4,
    lineHeight: 26,
    marginBottom: 8,
  },
  flameArena: {
    width: '100%',
    height: 205,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  subtitleText: {
    fontFamily: fontFamilies.medium,
    fontSize: 14,
    color: '#A1A1AA',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  buttonContainer: {
    width: '100%',
  },
  actionButton: {
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  actionButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  actionButtonLost: {
    backgroundColor: '#1E1E24',
    borderWidth: 1,
    borderColor: '#3F3F46',
  },
  actionButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  actionButtonText: {
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    letterSpacing: 1.4,
  },
  actionButtonTextActive: {
    color: '#000000',
  },
  actionButtonTextLost: {
    color: '#FFFFFF',
  },
});
