import { useEffect, useRef, useState } from 'react';
import { router } from 'expo-router';
import {
  Animated,
  Easing,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { Button } from '@/components/common/Button';
import { Screen } from '@/components/common/Screen';
import { StepIndicator } from '@/components/common/StepIndicator';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

const TOTAL_STEPS = 8;
const CURRENT_STEP = 2; // third step (0-indexed)

// Height Ruler constants
const MIN_HEIGHT = 130;
const MAX_HEIGHT = 230;
const TICK_SPACING = 16; // pixels per 1 cm

// Weight Dial constants
const MIN_WEIGHT = 40;
const MAX_WEIGHT = 160;

export default function PhysicalProfileScreen() {
  const [height, setHeight] = useState(181);
  const [weight, setWeight] = useState(75.0);
  const [targetWeight, setTargetWeight] = useState(82.5);

  const rulerScrollRef = useRef<ScrollView>(null);
  const startWeightRef = useRef(targetWeight);

  // Animations
  const headerAnim = useRef(new Animated.Value(0)).current;
  const heightAnim = useRef(new Animated.Value(0)).current;
  const weightAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(120, [
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 650,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(heightAnim, {
        toValue: 1,
        duration: 650,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(weightAnim, {
        toValue: 1,
        duration: 650,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(buttonAnim, {
        toValue: 1,
        duration: 650,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // Scroll Height ruler to initial value (181 cm) on mount
    setTimeout(() => {
      const initialX = (181 - MIN_HEIGHT) * TICK_SPACING;
      rulerScrollRef.current?.scrollTo({ x: initialX, animated: false });
    }, 100);
  }, [headerAnim, heightAnim, weightAnim, buttonAnim]);

  // PanResponder for Weight Dial Drag Gesture
  const dialPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        startWeightRef.current = targetWeight;
      },
      onPanResponderMove: (_, gestureState) => {
        // Horizontal drag sensitivity
        const delta = gestureState.dx / 12;
        const newTarget = Math.max(
          MIN_WEIGHT,
          Math.min(MAX_WEIGHT, Number((startWeightRef.current + delta).toFixed(1)))
        );
        setTargetWeight(newTarget);
        // Synchronize current weight smoothly
        setWeight(Number(Math.max(35, newTarget - 7.5).toFixed(1)));
      },
    })
  ).current;

  const fadeSlideStyle = (anim: Animated.Value) => ({
    opacity: anim,
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [25, 0],
        }),
      },
    ],
  });

  const handleContinue = () => {
    router.push('/(onboarding)/motivation');
  };

  const handleRulerScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const computedHeight = Math.round(MIN_HEIGHT + offsetX / TICK_SPACING);
    const clampedHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, computedHeight));
    if (clampedHeight !== height) {
      setHeight(clampedHeight);
    }
  };

  // Generate 48 dial ticks around the target weight gauge
  const totalDialTicks = 48;
  const rotationAngle = (targetWeight * 8) % 360;

  return (
    <Screen style={styles.screen}>
      {/* ─── Top Bar ─── */}
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backButton}>
          <Feather name="arrow-left" size={22} color="#FFFFFF" />
        </Pressable>
        <View style={styles.indicatorWrapper}>
          <StepIndicator totalSteps={TOTAL_STEPS} currentStep={CURRENT_STEP} />
        </View>
        <View style={styles.backButton} />
      </View>

      {/* ─── Scrollable Content ─── */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Title Header */}
        <Animated.View style={fadeSlideStyle(headerAnim)}>
          <Text style={styles.title}>Your physical profile.</Text>
          <Text style={styles.description}>
            Precision data leads to pro-athlete results.
          </Text>
        </Animated.View>

        {/* ─── Height Section ─── */}
        <Animated.View style={[styles.cardSection, fadeSlideStyle(heightAnim)]}>
          <View style={styles.headerRow}>
            <View style={styles.iconBox}>
              <MaterialCommunityIcons name="ruler" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.sectionLabel}>HEIGHT</Text>
            <View style={styles.valueWrapper}>
              <Text style={styles.goldValue}>{height}</Text>
              <Text style={styles.unitText}>CM</Text>
            </View>
          </View>

          {/* Interactive Horizontal Scroll Ruler */}
          <View style={styles.rulerContainer}>
            {/* Center Pointer Indicator */}
            <View style={styles.centerPointerWrapper} pointerEvents="none">
              <View style={styles.centerYellowLine} />
              <Text style={styles.centerValueText}>{height}</Text>
            </View>

            {/* Smooth ScrollView Ruler */}
            <ScrollView
              ref={rulerScrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={16}
              onScroll={handleRulerScroll}
              decelerationRate="fast"
              snapToInterval={TICK_SPACING}
              contentContainerStyle={styles.rulerScrollContent}
            >
              {Array.from({ length: MAX_HEIGHT - MIN_HEIGHT + 1 }).map((_, i) => {
                const val = MIN_HEIGHT + i;
                const isMajor = val % 5 === 0;
                return (
                  <View key={val} style={[styles.rulerTickWrapper, { width: TICK_SPACING }]}>
                    <View
                      style={[
                        styles.rulerTickLine,
                        isMajor ? styles.rulerTickMajor : styles.rulerTickMinor,
                      ]}
                    />
                    {isMajor ? (
                      <Text style={styles.rulerTickText}>{val}</Text>
                    ) : (
                      <Text style={styles.rulerTickEmpty}></Text>
                    )}
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </Animated.View>

        {/* ─── Weight & Target Section ─── */}
        <Animated.View style={[styles.cardSection, fadeSlideStyle(weightAnim)]}>
          <View style={styles.headerRow}>
            <View style={styles.iconBox}>
              <MaterialCommunityIcons name="scale-bathroom" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.sectionLabel}>WEIGHT</Text>
            <View style={styles.valueWrapper}>
              <Text style={styles.goldValue}>{weight.toFixed(1)}</Text>
              <Text style={styles.unitText}>KG</Text>
            </View>
          </View>

          {/* Touch-Scrollable Circular Target Gauge Dial */}
          <View style={styles.dialWrapper} {...dialPanResponder.panHandlers}>
            <View style={styles.dialCircle}>
              {/* Radial subtle ambient gold glow */}
              <LinearGradient
                colors={['transparent', 'rgba(229, 169, 60, 0.08)', 'rgba(229, 169, 60, 0.22)']}
                style={styles.dialGradientGlow}
              />

              {/* Top Pointer Yellow Arrow */}
              <View style={styles.yellowNeedleArrow} />

              {/* Ticks around the circle perimeter rotating with drag */}
              <View
                style={[
                  styles.ticksRotator,
                  { transform: [{ rotate: `${rotationAngle}deg` }] },
                ]}
              >
                {Array.from({ length: totalDialTicks }).map((_, i) => {
                  const angle = (i * 360) / totalDialTicks;
                  const isHighlight = i % 6 === 0;
                  return (
                    <View
                      key={i}
                      style={[
                        styles.dialTick,
                        {
                          transform: [
                            { rotate: `${angle}deg` },
                            { translateY: -106 },
                          ],
                        },
                        isHighlight && styles.dialTickHighlight,
                      ]}
                    />
                  );
                })}
              </View>

              {/* Center Target Info */}
              <View style={styles.dialCenterContent}>
                <Text style={styles.targetLabel}>TARGET</Text>

                {/* Target Weight Value + Stepper controls */}
                <View style={styles.targetRow}>
                  <Pressable
                    onPress={() => {
                      const newTarget = Math.max(MIN_WEIGHT, Number((targetWeight - 0.5).toFixed(1)));
                      setTargetWeight(newTarget);
                      setWeight(Number(Math.max(35, newTarget - 7.5).toFixed(1)));
                    }}
                    hitSlop={8}
                    style={styles.adjustBtn}
                  >
                    <Feather name="minus" size={14} color="#71717A" />
                  </Pressable>

                  <Text style={styles.targetValueText}>{targetWeight.toFixed(1)}</Text>

                  <Pressable
                    onPress={() => {
                      const newTarget = Math.min(MAX_WEIGHT, Number((targetWeight + 0.5).toFixed(1)));
                      setTargetWeight(newTarget);
                      setWeight(Number(Math.max(35, newTarget - 7.5).toFixed(1)));
                    }}
                    hitSlop={8}
                    style={styles.adjustBtn}
                  >
                    <Feather name="plus" size={14} color="#71717A" />
                  </Pressable>
                </View>

                {/* Yellow Bar under target */}
                <View style={styles.yellowBar} />
                <Text style={styles.dragHintText}>Swipe or drag dial to adjust</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* ─── Bottom CTA ─── */}
      <Animated.View style={[styles.bottomBar, fadeSlideStyle(buttonAnim)]}>
        <Button
          label="CONTINUE"
          onPress={handleContinue}
          variant="primary"
          style={styles.ctaButton}
          labelStyle={styles.ctaLabel}
        />
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#000000',
  },

  /* ─── Top Bar ─── */
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorWrapper: {
    flex: 1,
    alignItems: 'center',
  },

  /* ─── Scroll Content ─── */
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
  },

  title: {
    fontFamily: fontFamilies.bold,
    fontSize: 32,
    lineHeight: 38,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  description: {
    fontFamily: fontFamilies.regular,
    fontSize: 14,
    lineHeight: 20,
    color: '#71717A',
    marginBottom: 28,
  },

  /* ─── Section Cards ─── */
  cardSection: {
    marginBottom: 28,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 8,
    backgroundColor: '#0F0F11',
    borderWidth: 1,
    borderColor: '#222226',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  sectionLabel: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 11,
    letterSpacing: 2,
    color: '#71717A',
    textTransform: 'uppercase',
  },
  valueWrapper: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  goldValue: {
    fontFamily: fontFamilies.bold,
    fontSize: 34,
    color: colors.accentGold,
    marginRight: 4,
  },
  unitText: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 10,
    color: '#71717A',
    textTransform: 'uppercase',
  },

  /* ─── Ruler Component ─── */
  rulerContainer: {
    backgroundColor: '#09090B',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1B1B1E',
    height: 96,
    position: 'relative',
    justifyContent: 'center',
  },
  centerPointerWrapper: {
    position: 'absolute',
    left: '50%',
    top: 14,
    transform: [{ translateX: -1.25 }],
    alignItems: 'center',
    zIndex: 10,
  },
  centerYellowLine: {
    width: 2.5,
    height: 34,
    backgroundColor: colors.accentGold,
    borderRadius: 2,
    marginBottom: 4,
    shadowColor: colors.accentGold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 4,
  },
  centerValueText: {
    fontFamily: fontFamilies.bold,
    fontSize: 13,
    color: colors.accentGold,
  },
  rulerScrollContent: {
    paddingHorizontal: '50%',
    alignItems: 'center',
    paddingTop: 14,
  },
  rulerTickWrapper: {
    alignItems: 'center',
  },
  rulerTickLine: {
    width: 1,
    borderRadius: 0.5,
  },
  rulerTickMajor: {
    height: 18,
    backgroundColor: '#52525B',
  },
  rulerTickMinor: {
    height: 10,
    backgroundColor: '#27272A',
  },
  rulerTickText: {
    fontFamily: fontFamilies.regular,
    fontSize: 11,
    color: '#52525B',
    marginTop: 10,
  },
  rulerTickEmpty: {
    fontSize: 11,
    marginTop: 10,
  },

  /* ─── Dial Gauge Component ─── */
  dialWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  dialCircle: {
    width: 236,
    height: 236,
    borderRadius: 118,
    backgroundColor: '#070708',
    borderWidth: 1,
    borderColor: '#1A1A1D',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  dialGradientGlow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 118,
    borderBottomLeftRadius: 118,
    borderBottomRightRadius: 118,
  },
  yellowNeedleArrow: {
    position: 'absolute',
    top: 10,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: colors.accentGold,
    zIndex: 5,
  },
  ticksRotator: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialTick: {
    position: 'absolute',
    width: 1.5,
    height: 8,
    backgroundColor: '#27272A',
    borderRadius: 1,
  },
  dialTickHighlight: {
    backgroundColor: colors.accentGold,
    height: 11,
  },
  dialCenterContent: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 4,
  },
  targetLabel: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 11,
    letterSpacing: 2.5,
    color: '#71717A',
    marginBottom: 4,
  },
  targetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  adjustBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#141416',
    borderWidth: 1,
    borderColor: '#26262B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetValueText: {
    fontFamily: fontFamilies.bold,
    fontSize: 36,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  yellowBar: {
    width: 28,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.accentGold,
    marginTop: 6,
    marginBottom: 4,
  },
  dragHintText: {
    fontFamily: fontFamilies.regular,
    fontSize: 10,
    color: '#52525B',
  },

  /* ─── Bottom CTA ─── */
  bottomBar: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 12 : 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  ctaButton: {
    height: 56,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  ctaLabel: {
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    letterSpacing: 2,
    color: '#000000',
  },
});

