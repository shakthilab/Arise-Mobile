import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
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
import type { WeekStatus } from '@/types/user';
import { generateWeekDaysFromWeekStatus } from '../streaks/WeeklyTracker';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// 12 Floating Confetti Sparkles neatly positioned around central badge
const CONFETTI_PIECES = [
  { id: 1, x: -55, y: -25, color: '#FFA726', size: 7, delay: 100, shape: 'rect' },
  { id: 2, x: 58, y: -30, color: '#FE5B01', size: 6, delay: 150, shape: 'circle' },
  { id: 3, x: -65, y: 15, color: '#9D4EDD', size: 7, delay: 200, shape: 'rect' },
  { id: 4, x: 62, y: 18, color: '#FFA726', size: 8, delay: 120, shape: 'circle' },
  { id: 5, x: -35, y: -48, color: '#FFFFFF', size: 5, delay: 180, shape: 'circle' },
  { id: 6, x: 38, y: -50, color: '#3DDC97', size: 6, delay: 220, shape: 'rect' },
  { id: 7, x: -70, y: -8, color: '#FE5B01', size: 6, delay: 250, shape: 'rect' },
  { id: 8, x: 68, y: -5, color: '#FFFFFF', size: 5, delay: 140, shape: 'circle' },
  { id: 9, x: -25, y: 45, color: '#FFA726', size: 6, delay: 260, shape: 'circle' },
  { id: 10, x: 28, y: 42, color: '#9D4EDD', size: 7, delay: 190, shape: 'rect' },
  { id: 11, x: -8, y: -58, color: '#FFA726', size: 6, delay: 210, shape: 'rect' },
  { id: 12, x: 8, y: -60, color: '#FE5B01', size: 7, delay: 230, shape: 'circle' },
];

function ConfettiSparkle({ x, y, color, size, delay, shape }: (typeof CONFETTI_PIECES)[0]) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(delay, withSpring(1, { damping: 10, stiffness: 200 }));
    translateY.value = withDelay(
      delay,
      withSequence(
        withTiming(-10, { duration: 400, easing: Easing.out(Easing.quad) }),
        withTiming(2, { duration: 500, easing: Easing.inOut(Easing.quad) })
      )
    );
    rotate.value = withDelay(delay, withTiming(270, { duration: 800 }));

    // Fades in, holds briefly, then fades out completely to 0
    opacity.value = withDelay(
      delay,
      withSequence(
        withTiming(1, { duration: 150 }),
        withTiming(1, { duration: 600 }),
        withTiming(0, { duration: 450, easing: Easing.in(Easing.quad) })
      )
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: x },
      { translateY: y + translateY.value },
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.confettiPiece,
        {
          width: size,
          height: shape === 'rect' ? size * 1.5 : size,
          borderRadius: shape === 'circle' ? size / 2 : 2,
          backgroundColor: color,
        },
        style,
      ]}
    />
  );
}

export interface TaskCompletionBottomSheetProps {
  visible: boolean;
  title?: string;
  subtitle?: string;
  streakDays?: number;
  xp?: number;
  weekStatus?: WeekStatus | null;
  onClose: () => void;
  onContinue?: () => void;
}

export function TaskCompletionBottomSheet({
  visible,
  title = 'Quest Cleared',
  subtitle = 'One day down. The flame grows stronger with each rise.',
  streakDays = 1,
  xp = 10,
  weekStatus,
  onClose,
  onContinue,
}: TaskCompletionBottomSheetProps) {
  const [modalVisible, setModalVisible] = useState(visible);

  const backdropOpacity = useSharedValue(0);
  const translateY = useSharedValue(SCREEN_HEIGHT);

  const defaultSubtitle = `Make it a ${streakDays + 1}-day streak to form a healthy habit`;
  const displaySubtitle = subtitle ?? defaultSubtitle;

  const weekDays = React.useMemo(() => {
    return generateWeekDaysFromWeekStatus(weekStatus);
  }, [weekStatus]);

  useEffect(() => {
    if (visible) {
      setModalVisible(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      
      // Animate up smoothly without sticking
      backdropOpacity.value = withTiming(1, { duration: 250 });
      translateY.value = withSpring(0, {
        damping: 24,
        stiffness: 240,
        mass: 0.8,
      });
    } else if (modalVisible) {
      dismissSheet();
    }
  }, [visible]);

  const dismissSheet = (callback?: () => void) => {
    const safeCallback = typeof callback === 'function' ? callback : undefined;
    backdropOpacity.value = withTiming(0, { duration: 200 });
    translateY.value = withTiming(
      SCREEN_HEIGHT,
      { duration: 240, easing: Easing.in(Easing.cubic) },
      (finished) => {
        if (finished) {
          runOnJS(finishClose)(safeCallback);
        }
      }
    );
  };

  const finishClose = (callback?: () => void) => {
    setModalVisible(false);
    onClose();
    if (typeof callback === 'function') {
      callback();
    }
  };

  const handleContinuePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    dismissSheet(onContinue);
  };

  // Drag pan gesture for smooth swipe down
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY;
        backdropOpacity.value = Math.max(0, 1 - event.translationY / (SCREEN_HEIGHT * 0.4));
      }
    })
    .onEnd((event) => {
      if (event.translationY > 100 || event.velocityY > 600) {
        runOnJS(dismissSheet)();
      } else {
        translateY.value = withSpring(0, { damping: 24, stiffness: 250 });
        backdropOpacity.value = withTiming(1, { duration: 150 });
      }
    });

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!modalVisible) return null;

  return (
    <Modal
      transparent
      visible={modalVisible}
      animationType="none"
      onRequestClose={() => dismissSheet()}
      statusBarTranslucent
    >
      <View style={styles.modalOverlay}>
        {/* Backdrop (Tapping closes modal) */}
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => dismissSheet()} />
        </Animated.View>

        {/* Bottom Sheet Card */}
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.bottomSheetCard, sheetStyle]}>
            {/* Top Drag Handle Bar (_) */}
            <View style={styles.handleContainer}>
              <View style={styles.handleBar} />
            </View>

            {/* Confetti & Central Orange Lightning Icon Badge Section */}
            <View style={styles.iconSection}>
              {/* Confetti Particles Floating */}
              {CONFETTI_PIECES.map((piece) => (
                <ConfettiSparkle key={piece.id} {...piece} />
              ))}

              {/* Central Elevated Orange Badge Circle with White Lightning Icon */}
              <View style={styles.badgeGlowRing}>
                <View style={styles.badgeOrangeCircle}>
                  {/* Grid Lines Accent */}
                  <View style={styles.gridOverlay}>
                    <View style={styles.gridVerticalLineLeft} />
                    <View style={styles.gridVerticalLineRight} />
                    <View style={styles.gridHorizontalLineTop} />
                    <View style={styles.gridHorizontalLineBottom} />
                  </View>

                  <View style={styles.lightningIconContainer}>
                    <Ionicons name="flame" size={38} color="#FFFFFF" />
                  </View>
                </View>
              </View>
            </View>

            {/* Headline Title & Subtitle */}
            <View style={styles.textBlock}>
              <Text style={styles.headlineTitle}>{title}</Text>
              <Text style={styles.subtitleText}>{displaySubtitle}</Text>
            </View>

            {/* Streak Calendar Weekday Row */}
            <View style={styles.streakRowContainer}>
              {weekDays.map((day, idx) => {
                const isToday = day.isToday;
                const isDone = day.isDone;
                const isMissed = day.status === 'missed';

                return (
                  <View key={idx} style={styles.dayCol}>
                    <Text
                      style={[
                        styles.dayNameText,
                        (isToday || isDone) && styles.dayNameTextActive,
                        isMissed && styles.dayNameTextMissed,
                      ]}
                    >
                      {day.dayName}
                    </Text>

                    <View style={styles.dayIconSlot}>
                      {isToday ? (
                        <View style={styles.activeTodayCircle}>
                          <Ionicons name="flash" size={14} color="#FFFFFF" />
                        </View>
                      ) : isDone ? (
                        <View style={styles.completedDayCircle}>
                          <Ionicons name="checkmark" size={14} color="#FE5B01" />
                        </View>
                      ) : isMissed ? (
                        <View style={styles.missedDayCircle}>
                          <Text style={styles.missedDateNumText}>{day.dateNum}</Text>
                        </View>
                      ) : (
                        <Text style={styles.dateNumText}>{day.dateNum}</Text>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Bottom Action Button: White Continue Button */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                activeOpacity={0.88}
                style={styles.continueButton}
                onPress={handleContinuePress}
              >
                <Text style={styles.continueButtonText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </GestureDetector>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
  },

  /* Bottom Sheet Container (App Dark Theme) */
  bottomSheetCard: {
    width: '100%',
    backgroundColor: '#121215',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderWidth: 1,
    borderColor: '#26262B',
    paddingHorizontal: 24,
    paddingTop: 14,
    paddingBottom: 36,
    alignItems: 'center',
    elevation: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -12 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
  },

  /* Top Handle Bar Indicator (_) */
  handleContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 4,
    marginBottom: 12,
  },
  handleBar: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#3F3F46',
  },

  /* Confetti & Central Icon Badge Section */
  iconSection: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 14,
    paddingTop: 10,
  },
  confettiPiece: {
    position: 'absolute',
  },
  badgeGlowRing: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(254, 91, 1, 0.18)',
    borderWidth: 1.5,
    borderColor: 'rgba(254, 91, 1, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FE5B01',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 8,
  },
  badgeOrangeCircle: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: '#FE5B01',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#FE5B01',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.15,
  },
  gridVerticalLineLeft: {
    position: 'absolute',
    left: 24,
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#FFFFFF',
  },
  gridVerticalLineRight: {
    position: 'absolute',
    right: 24,
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#FFFFFF',
  },
  gridHorizontalLineTop: {
    position: 'absolute',
    top: 24,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#FFFFFF',
  },
  gridHorizontalLineBottom: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#FFFFFF',
  },
  lightningIconContainer: {
    zIndex: 2,
  },
  xpPillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(254, 91, 1, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(254, 91, 1, 0.4)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginTop: 10,
  },
  xpPillText: {
    fontFamily: fontFamilies.bold,
    fontSize: 11,
    color: '#FE5B01',
    letterSpacing: 0.5,
  },

  /* Text Block */
  textBlock: {
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 12,
  },
  headlineTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 22,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 8,
  },
  subtitleText: {
    fontFamily: fontFamilies.medium,
    fontSize: 13,
    color: '#A1A1AA',
    textAlign: 'center',
    lineHeight: 18,
  },

  /* Streak Weekday Calendar Row */
  streakRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: '#18181C',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#26262B',
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 26,
  },
  dayCol: {
    alignItems: 'center',
    flex: 1,
  },
  dayNameText: {
    fontFamily: fontFamilies.medium,
    fontSize: 11,
    color: '#71717A',
    marginBottom: 8,
  },
  dayNameTextActive: {
    color: '#FFFFFF',
    fontFamily: fontFamilies.bold,
  },
  dayIconSlot: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTodayCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FE5B01',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FE5B01',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 4,
  },
  completedDayCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(254, 91, 1, 0.12)',
    borderWidth: 1.5,
    borderColor: '#FE5B01',
    alignItems: 'center',
    justifyContent: 'center',
  },
  missedDayCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(39, 39, 42, 0.4)',
    borderWidth: 1,
    borderColor: '#3F3F46',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.45,
  },
  missedDateNumText: {
    fontFamily: fontFamilies.medium,
    fontSize: 13,
    color: '#71717A',
  },
  dayNameTextMissed: {
    color: '#52525B',
    opacity: 0.5,
  },
  dateNumText: {
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    color: '#D4D4D8',
  },

  /* Bottom Action Button */
  buttonContainer: {
    width: '100%',
  },
  continueButton: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  continueButtonText: {
    fontFamily: fontFamilies.bold,
    fontSize: 16,
    color: '#0A0A0A',
    letterSpacing: 0.5,
  },
});
