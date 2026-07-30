import { useEffect, useRef, useState } from 'react';
import { router } from 'expo-router';
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import { Button } from '@/components/common/Button';
import { Screen } from '@/components/common/Screen';
import { StepIndicator } from '@/components/common/StepIndicator';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

const TOTAL_STEPS = 8;
const CURRENT_STEP = 2; // third step (0-indexed)

// Height Ruler constants
const MIN_HEIGHT = 80;
const MAX_HEIGHT = 230;
const TICK_SPACING = 16; // pixels per 1 cm

// Weight Dial constants
const MIN_WEIGHT = 40;
const MAX_WEIGHT = 160;

const KG_TO_LBS = 2.20462;

const cmToFtIn = (cm: number) => {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return {
    feet,
    inches,
    str: `${feet}'${inches}"`,
  };
};

export default function PhysicalProfileScreen() {
  const [height, setHeight] = useState(181); // stored in CM internally
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>('cm');
  const [weight, setWeight] = useState(75.0); // stored in KG internally
  const [targetWeight, setTargetWeight] = useState(82.5); // stored in KG internally
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const weightRef = useRef(weight);
  weightRef.current = weight;

  const targetWeightRef = useRef(targetWeight);
  targetWeightRef.current = targetWeight;

  const weightUnitRef = useRef(weightUnit);
  weightUnitRef.current = weightUnit;

  // Edit Height Modal state
  const [isHeightModalOpen, setIsHeightModalOpen] = useState(false);
  const [inputHeight, setInputHeight] = useState('181');
  const [heightError, setHeightError] = useState('');

  // Edit Weight Modal state
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const [inputWeight, setInputWeight] = useState('75.0');
  const [weightError, setWeightError] = useState('');

  const rulerScrollRef = useRef<ScrollView>(null);
  const startWeightRef = useRef(targetWeight);

  const triggerHaptic = () => {
    try {
      Haptics.selectionAsync();
    } catch (e) {
      console.warn('Failed to trigger haptics', e);
    }
  };

  // Computed displayed weights & min/max bounds
  const displayWeight = weightUnit === 'kg' ? weight : weight * KG_TO_LBS;
  const displayTargetWeight = weightUnit === 'kg' ? targetWeight : targetWeight * KG_TO_LBS;
  const minWeightVal = 40; // minimum weight is 40 in either unit as requested
  const maxWeightVal = weightUnit === 'kg' ? 160 : 350;

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
        startWeightRef.current = targetWeightRef.current;
        setScrollEnabled(false);
      },
      onPanResponderMove: (_, gestureState) => {
        // Horizontal drag sensitivity
        const delta = gestureState.dx / 12;
        const newWeight = Math.max(
          MIN_WEIGHT,
          Math.min(MAX_WEIGHT, Number((startWeightRef.current + delta).toFixed(1)))
        );

        // Calculate display weight before and after change
        const currentDisplay = weightUnitRef.current === 'kg' ? weightRef.current : weightRef.current * KG_TO_LBS;
        const newDisplay = weightUnitRef.current === 'kg' ? newWeight : newWeight * KG_TO_LBS;

        // Trigger haptic every 0.5 increment of the active display unit
        const currentRounded = Math.round(currentDisplay * 2) / 2;
        const newRounded = Math.round(newDisplay * 2) / 2;

        if (newRounded !== currentRounded) {
          triggerHaptic();
        }

        setTargetWeight(newWeight);
        setWeight(newWeight);
      },
      onPanResponderRelease: () => {
        setScrollEnabled(true);
      },
      onPanResponderTerminate: () => {
        setScrollEnabled(true);
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
      triggerHaptic();
    }
  };

  const handleOpenHeightModal = () => {
    setInputHeight(height.toString());
    setHeightError('');
    setIsHeightModalOpen(true);
  };

  const handleSaveHeight = () => {
    const parsed = parseInt(inputHeight, 10);
    if (isNaN(parsed) || parsed < MIN_HEIGHT || parsed > MAX_HEIGHT) {
      setHeightError(`Height must be between ${MIN_HEIGHT} and ${MAX_HEIGHT} CM.`);
      return;
    }
    setHeight(parsed);
    setIsHeightModalOpen(false);

    // Scroll height ruler smoothly to new target
    const targetX = (parsed - MIN_HEIGHT) * TICK_SPACING;
    rulerScrollRef.current?.scrollTo({ x: targetX, animated: true });
  };

  const handleHeightIncrement = () => {
    const parsed = parseInt(inputHeight, 10) || height;
    if (parsed < MAX_HEIGHT) {
      const next = parsed + 1;
      setInputHeight(next.toString());
      if (next >= MIN_HEIGHT && next <= MAX_HEIGHT) setHeightError('');
    }
  };

  const handleHeightDecrement = () => {
    const parsed = parseInt(inputHeight, 10) || height;
    if (parsed > MIN_HEIGHT) {
      const prev = parsed - 1;
      setInputHeight(prev.toString());
      if (prev >= MIN_HEIGHT && prev <= MAX_HEIGHT) setHeightError('');
    }
  };

  const handleOpenWeightModal = () => {
    setInputWeight(displayWeight.toFixed(1));
    setWeightError('');
    setIsWeightModalOpen(true);
  };

  const handleSaveWeight = () => {
    const parsed = parseFloat(inputWeight);
    if (isNaN(parsed) || parsed < minWeightVal || parsed > maxWeightVal) {
      setWeightError(`Weight must be between ${minWeightVal} and ${maxWeightVal} ${weightUnit.toUpperCase()}.`);
      return;
    }
    if (weightUnit === 'kg') {
      const clampedKg = Number(Math.max(MIN_WEIGHT, Math.min(MAX_WEIGHT, parsed)).toFixed(1));
      setWeight(clampedKg);
      setTargetWeight(clampedKg);
    } else {
      const weightInKg = parsed / KG_TO_LBS;
      const clampedKg = Number(Math.max(MIN_WEIGHT, Math.min(MAX_WEIGHT, weightInKg)).toFixed(1));
      setWeight(clampedKg);
      setTargetWeight(clampedKg);
    }
    setIsWeightModalOpen(false);
  };

  const handleWeightIncrement = () => {
    const parsed = parseFloat(inputWeight) || displayWeight;
    if (parsed < maxWeightVal) {
      const next = Number((parsed + 0.5).toFixed(1));
      setInputWeight(next.toFixed(1));
      if (next >= minWeightVal && next <= maxWeightVal) setWeightError('');
    }
  };

  const handleWeightDecrement = () => {
    const parsed = parseFloat(inputWeight) || displayWeight;
    if (parsed > minWeightVal) {
      const prev = Number((parsed - 0.5).toFixed(1));
      setInputWeight(prev.toFixed(1));
      if (prev >= minWeightVal && prev <= maxWeightVal) setWeightError('');
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
        scrollEnabled={scrollEnabled}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Title Header */}
        <Animated.View style={fadeSlideStyle(headerAnim)}>
          <Text style={styles.title}>Your physical profile</Text>
          <Text style={styles.description}>
            Precision data leads to pro-athlete results
          </Text>
        </Animated.View>

        {/* ─── Height Section ─── */}
        <Animated.View style={[styles.cardSection, fadeSlideStyle(heightAnim)]}>
          <View style={styles.headerRow}>
            <Text style={styles.sectionLabel}>HEIGHT</Text>

            {/* CM / FT Unit Switcher Pill */}
            <View style={styles.unitTogglePillContainer}>
              <Pressable
                onPress={() => setHeightUnit('cm')}
                style={[styles.unitToggleBtn, heightUnit === 'cm' && styles.unitToggleBtnActive]}
                hitSlop={4}
              >
                <Text style={[styles.unitToggleText, heightUnit === 'cm' && styles.unitToggleTextActive]}>
                  CM
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setHeightUnit('ft')}
                style={[styles.unitToggleBtn, heightUnit === 'ft' && styles.unitToggleBtnActive]}
                hitSlop={4}
              >
                <Text style={[styles.unitToggleText, heightUnit === 'ft' && styles.unitToggleTextActive]}>
                  FT
                </Text>
              </Pressable>
            </View>

            {/* Tap to Edit Height Value */}
            <Pressable
              onPress={handleOpenHeightModal}
              style={styles.editableValueContainer}
              hitSlop={10}
            >
              <Text style={styles.goldValue}>
                {heightUnit === 'cm' ? height : cmToFtIn(height).str}
              </Text>
              <Text style={styles.unitText}>{heightUnit === 'cm' ? 'CM' : 'FT'}</Text>
            </Pressable>
          </View>

          {/* Interactive Horizontal Scroll Ruler */}
          <View style={styles.rulerContainer}>
            {/* Center Pointer Indicator */}
            <View style={styles.centerPointerWrapper} pointerEvents="none">
              <View style={styles.centerYellowLine} />
              <Text style={styles.centerValueText}>
                {heightUnit === 'cm' ? height : cmToFtIn(height).str}
              </Text>
            </View>

            {/* Smooth ScrollView Ruler */}
            <ScrollView
              ref={rulerScrollRef}
              horizontal
              onScrollBeginDrag={() => setScrollEnabled(false)}
              onScrollEndDrag={() => setScrollEnabled(true)}
              onMomentumScrollEnd={() => setScrollEnabled(true)}
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
                      <Text style={styles.rulerTickText}>
                        {heightUnit === 'cm' ? val : cmToFtIn(val).str}
                      </Text>
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
            <Text style={styles.sectionLabel}>WEIGHT</Text>

            {/* KG / LBS Unit Switcher Pill */}
            <View style={styles.unitTogglePillContainer}>
              <Pressable
                onPress={() => setWeightUnit('kg')}
                style={[styles.unitToggleBtn, weightUnit === 'kg' && styles.unitToggleBtnActive]}
                hitSlop={4}
              >
                <Text style={[styles.unitToggleText, weightUnit === 'kg' && styles.unitToggleTextActive]}>
                  KG
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setWeightUnit('lbs')}
                style={[styles.unitToggleBtn, weightUnit === 'lbs' && styles.unitToggleBtnActive]}
                hitSlop={4}
              >
                <Text style={[styles.unitToggleText, weightUnit === 'lbs' && styles.unitToggleTextActive]}>
                  LBS
                </Text>
              </Pressable>
            </View>

            {/* Tap to Edit Weight Value */}
            <Pressable
              onPress={handleOpenWeightModal}
              style={styles.editableValueContainer}
              hitSlop={10}
            >
              <Text style={styles.goldValue}>{displayWeight.toFixed(1)}</Text>
              <Text style={styles.unitText}>{weightUnit.toUpperCase()}</Text>
            </Pressable>
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
                {/* Target Weight Value + Stepper controls */}
                <View style={styles.targetRow}>
                  <Pressable
                    onPress={() => {
                      const step = weightUnit === 'kg' ? 0.5 : 0.5 / KG_TO_LBS;
                      const next = Math.max(MIN_WEIGHT, Number((weight - step).toFixed(1)));
                      if (next !== weight) {
                        setWeight(next);
                        setTargetWeight(next);
                        triggerHaptic();
                      }
                    }}
                    hitSlop={8}
                    style={styles.adjustBtn}
                  >
                    <Feather name="minus" size={14} color="#71717A" />
                  </Pressable>

                  <Text style={styles.targetValueText}>{displayWeight.toFixed(1)}</Text>

                  <Pressable
                    onPress={() => {
                      const step = weightUnit === 'kg' ? 0.5 : 0.5 / KG_TO_LBS;
                      const next = Math.min(MAX_WEIGHT, Number((weight + step).toFixed(1)));
                      if (next !== weight) {
                        setWeight(next);
                        setTargetWeight(next);
                        triggerHaptic();
                      }
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

        {/* ─── Edit Weight Bottom Sheet Modal ─── */}
        <Modal
          visible={isWeightModalOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setIsWeightModalOpen(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalOverlay}
          >
            <Pressable style={styles.modalBackdrop} onPress={() => setIsWeightModalOpen(false)} />
            <View style={styles.modalSheet}>
              <View style={styles.modalHandle} />

              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>EDIT WEIGHT ({weightUnit.toUpperCase()})</Text>
                <Pressable onPress={() => setIsWeightModalOpen(false)} hitSlop={10}>
                  <Feather name="x" size={20} color="#A1A1AA" />
                </Pressable>
              </View>

              <Text style={styles.modalSubtitle}>
                Specify your weight within the scale bounds ({minWeightVal} – {maxWeightVal} {weightUnit.toUpperCase()}).
              </Text>

              {/* Stepper & Manual Input Row */}
              <View style={styles.modalInputRow}>
                <Pressable
                  onPress={handleWeightDecrement}
                  style={styles.stepperButton}
                  hitSlop={6}
                >
                  <Feather name="minus" size={20} color="#FFFFFF" />
                </Pressable>

                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.modalTextInput}
                    value={inputWeight}
                    onChangeText={(txt) => {
                      setInputWeight(txt);
                      setWeightError('');
                    }}
                    keyboardType="decimal-pad"
                    maxLength={5}
                    selectTextOnFocus
                  />
                  <Text style={styles.modalInputUnit}>{weightUnit.toUpperCase()}</Text>
                </View>

                <Pressable
                  onPress={handleWeightIncrement}
                  style={styles.stepperButton}
                  hitSlop={6}
                >
                  <Feather name="plus" size={20} color="#FFFFFF" />
                </Pressable>
              </View>

              {/* Validation Error Message */}
              {!!weightError && (
                <View style={styles.errorContainer}>
                  <Feather name="alert-circle" size={14} color="#EF4444" />
                  <Text style={styles.errorText}>{weightError}</Text>
                </View>
              )}

              {/* Action Buttons */}
              <View style={styles.modalActionRow}>
                <Pressable
                  style={styles.modalCancelButton}
                  onPress={() => setIsWeightModalOpen(false)}
                >
                  <Text style={styles.modalCancelText}>CANCEL</Text>
                </Pressable>

                <Pressable
                  style={styles.modalSaveButton}
                  onPress={handleSaveWeight}
                >
                  <Text style={styles.modalSaveText}>SAVE</Text>
                </Pressable>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
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

      {/* ─── Edit Height Bottom Sheet Modal ─── */}
      <Modal
        visible={isHeightModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsHeightModalOpen(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <Pressable style={styles.modalBackdrop} onPress={() => setIsHeightModalOpen(false)} />
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />

            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>EDIT HEIGHT ({heightUnit.toUpperCase()})</Text>
              <Pressable onPress={() => setIsHeightModalOpen(false)} hitSlop={10}>
                <Feather name="x" size={20} color="#A1A1AA" />
              </Pressable>
            </View>

            <Text style={styles.modalSubtitle}>
              Specify your height within the scale bounds ({MIN_HEIGHT} – {MAX_HEIGHT} CM / {cmToFtIn(MIN_HEIGHT).str} – {cmToFtIn(MAX_HEIGHT).str}).
            </Text>

            {/* Stepper & Manual Input Row */}
            <View style={styles.modalInputRow}>
              <Pressable
                onPress={handleHeightDecrement}
                style={styles.stepperButton}
                hitSlop={6}
              >
                <Feather name="minus" size={20} color="#FFFFFF" />
              </Pressable>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.modalTextInput}
                  value={inputHeight}
                  onChangeText={(txt) => {
                    setInputHeight(txt);
                    setHeightError('');
                  }}
                  keyboardType="number-pad"
                  maxLength={3}
                  selectTextOnFocus
                />
                <Text style={styles.modalInputUnit}>CM</Text>
              </View>

              <Pressable
                onPress={handleHeightIncrement}
                style={styles.stepperButton}
                hitSlop={6}
              >
                <Feather name="plus" size={20} color="#FFFFFF" />
              </Pressable>
            </View>

            {/* Validation Error Message */}
            {!!heightError && (
              <View style={styles.errorContainer}>
                <Feather name="alert-circle" size={14} color="#EF4444" />
                <Text style={styles.errorText}>{heightError}</Text>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.modalActionRow}>
              <Pressable
                style={styles.modalCancelButton}
                onPress={() => setIsHeightModalOpen(false)}
              >
                <Text style={styles.modalCancelText}>CANCEL</Text>
              </Pressable>

              <Pressable
                style={styles.modalSaveButton}
                onPress={handleSaveHeight}
              >
                <Text style={styles.modalSaveText}>SAVE</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  unitTogglePillContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141416',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#27272A',
    padding: 2,
    marginLeft: 12,
  },
  unitToggleBtn: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  unitToggleBtnActive: {
    backgroundColor: colors.accentGold,
  },
  unitToggleText: {
    fontFamily: fontFamilies.bold,
    fontSize: 10,
    color: '#71717A',
  },
  unitToggleTextActive: {
    color: '#000000',
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
    ...StyleSheet.absoluteFillObject,
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

  editableValueContainer: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'baseline',
  },

  /* ─── Edit Modal / Bottom Sheet ─── */
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  modalSheet: {
    backgroundColor: '#0D0D0E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: '#27272A',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
  },
  modalHandle: {
    width: 36,
    height: 4,
    backgroundColor: '#27272A',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  modalTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 16,
    letterSpacing: 1.5,
    color: '#FFFFFF',
  },
  modalSubtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: 12,
    color: '#A1A1AA',
    marginBottom: 20,
  },
  modalInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 16,
  },
  stepperButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#27272A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111114',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 16,
    height: 56,
    minWidth: 150,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  modalTextInput: {
    fontFamily: fontFamilies.bold,
    fontSize: 30,
    color: '#FFFFFF',
    textAlign: 'center',
    minWidth: 70,
    paddingVertical: 0,
    height: '100%',
  },
  modalInputUnit: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 13,
    color: '#71717A',
    marginLeft: 4,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    justifyContent: 'center',
    marginBottom: 16,
  },
  errorText: {
    fontFamily: fontFamilies.medium,
    fontSize: 12,
    color: '#EF4444',
  },
  modalActionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalCancelButton: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#111114',
    borderWidth: 1,
    borderColor: '#27272A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: {
    fontFamily: fontFamilies.bold,
    fontSize: 12,
    letterSpacing: 2,
    color: '#A1A1AA',
  },
  modalSaveButton: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSaveText: {
    fontFamily: fontFamilies.bold,
    fontSize: 12,
    letterSpacing: 2,
    color: '#000000',
  },
});

