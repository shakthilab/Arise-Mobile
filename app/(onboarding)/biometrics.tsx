import { useEffect, useRef, useState } from 'react';
import { router } from 'expo-router';
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { Button } from '@/components/common/Button';
import { Screen } from '@/components/common/Screen';
import { StepIndicator } from '@/components/common/StepIndicator';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';
import { useOnboardingStore } from '@/store/useOnboardingStore';

const TOTAL_STEPS = 8;
const CURRENT_STEP = 1; // second step (0-indexed)

const MIN_AGE = 8;
const MAX_AGE = 80;
const TICK_SPACING = 16;

const getMetabolicClassification = (currentAge: number) => {
  if (currentAge < 18) return { label: 'NEURAL GROWTH BASELINE', code: 'VEC-01' };
  if (currentAge < 30) return { label: 'PRIME VECTOR (OPTIMAL RECOVERY)', code: 'VEC-02' };
  if (currentAge < 46) return { label: 'VETERAN ADAPTATION', code: 'VEC-03' };
  return { label: 'APEX MASTERY PARAMETERS', code: 'VEC-04' };
};

export default function BiometricsScreen() {
  const storeGender = useOnboardingStore((s) => s.gender);
  const storeAge = useOnboardingStore((s) => s.age);
  const setGenderStore = useOnboardingStore((s) => s.setGender);
  const setAgeStore = useOnboardingStore((s) => s.setAge);

  const [gender, setGender] = useState<'male' | 'female' | 'other'>(storeGender);
  const [age, setAge] = useState(storeAge);

  const [scrollEnabled, setScrollEnabled] = useState(true);

  // Edit Age Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputAge, setInputAge] = useState(storeAge.toString());
  const [errorMsg, setErrorMsg] = useState('');

  const ageScrollRef = useRef<ScrollView>(null);

  // Animations
  const headerAnim = useRef(new Animated.Value(0)).current;
  const genderAnim = useRef(new Animated.Value(0)).current;
  const ageAnim = useRef(new Animated.Value(0)).current;
  const noteAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  const triggerHaptic = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {
      try {
        Haptics.selectionAsync();
      } catch (inner) {
        console.warn('Failed to trigger haptics', inner);
      }
    }
  };

  useEffect(() => {
    Animated.stagger(120, [
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 650,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(genderAnim, {
        toValue: 1,
        duration: 650,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(ageAnim, {
        toValue: 1,
        duration: 650,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(noteAnim, {
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

    // Scroll Age ruler to initial value horizontally
    setTimeout(() => {
      const initialX = (storeAge - MIN_AGE) * TICK_SPACING;
      ageScrollRef.current?.scrollTo({ x: initialX, animated: false });
    }, 100);
  }, [headerAnim, genderAnim, ageAnim, noteAnim, buttonAnim, storeAge]);

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
    setGenderStore(gender);
    setAgeStore(age);
    // Navigate to step 3: physical profile
    router.push('/(onboarding)/physical-profile');
  };

  const handleAgeScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const computedAge = Math.round(MIN_AGE + offsetX / TICK_SPACING);
    const clampedAge = Math.max(MIN_AGE, Math.min(MAX_AGE, computedAge));
    if (clampedAge !== age) {
      setAge(clampedAge);
      triggerHaptic();
    }
  };

  const handleSelectAge = (newAge: number) => {
    const clamped = Math.max(MIN_AGE, Math.min(MAX_AGE, newAge));
    if (clamped !== age) {
      setAge(clamped);
      triggerHaptic();
      setTimeout(() => {
        const targetX = (clamped - MIN_AGE) * TICK_SPACING;
        ageScrollRef.current?.scrollTo({ x: targetX, animated: true });
      }, 50);
    }
  };

  const handleOpenEditModal = () => {
    setInputAge(age.toString());
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleSaveAge = () => {
    const parsed = parseInt(inputAge, 10);
    if (isNaN(parsed) || parsed < MIN_AGE || parsed > MAX_AGE) {
      setErrorMsg(`Age must be between ${MIN_AGE} and ${MAX_AGE} YRS.`);
      return;
    }
    setAge(parsed);
    setIsModalOpen(false);

    // Scroll ruler scale smoothly to new age position after modal closes
    setTimeout(() => {
      const targetX = (parsed - MIN_AGE) * TICK_SPACING;
      ageScrollRef.current?.scrollTo({ x: targetX, animated: true });
    }, 150);
  };

  const handleIncrement = () => {
    const parsed = parseInt(inputAge, 10) || age;
    if (parsed < MAX_AGE) {
      const next = parsed + 1;
      setInputAge(next.toString());
      triggerHaptic();
      if (next >= MIN_AGE && next <= MAX_AGE) setErrorMsg('');
    }
  };

  const handleDecrement = () => {
    const parsed = parseInt(inputAge, 10) || age;
    if (parsed > MIN_AGE) {
      const prev = parsed - 1;
      setInputAge(prev.toString());
      triggerHaptic();
      if (prev >= MIN_AGE && prev <= MAX_AGE) setErrorMsg('');
    }
  };

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
          <Text style={styles.title}>Tell us about yourself</Text>
          <Text style={styles.description}>
            Your gender and age form your baseline.{"\n"}Specify these details to calibrate your potential.
          </Text>
        </Animated.View>

        {/* ─── Section 1: GENDER ─── */}
        <Animated.View style={[styles.sectionContainer, fadeSlideStyle(genderAnim)]}>
          <Text style={styles.sectionTitle}>GENDER</Text>
          <View style={styles.genderRow}>
            {/* Male Card */}
            <Pressable
              onPress={() => setGender('male')}
              style={[
                styles.genderCard,
                gender === 'male' && styles.genderCardSelected,
              ]}
            >
              <Ionicons
                name="male"
                size={30}
                color={gender === 'male' ? colors.accentGold : '#71717A'}
                style={styles.genderIcon}
              />
              <Text style={[styles.genderText, gender === 'male' && styles.genderTextSelected]}>
                MALE
              </Text>
            </Pressable>

            {/* Female Card */}
            <Pressable
              onPress={() => setGender('female')}
              style={[
                styles.genderCard,
                gender === 'female' && styles.genderCardSelected,
              ]}
            >
              <Ionicons
                name="female"
                size={30}
                color={gender === 'female' ? colors.accentGold : '#71717A'}
                style={styles.genderIcon}
              />
              <Text style={[styles.genderText, gender === 'female' && styles.genderTextSelected]}>
                FEMALE
              </Text>
            </Pressable>

            {/* Other Card */}
            <Pressable
              onPress={() => setGender('other')}
              style={[
                styles.genderCard,
                gender === 'other' && styles.genderCardSelected,
              ]}
            >
              <Ionicons
                name="transgender"
                size={30}
                color={gender === 'other' ? colors.accentGold : '#71717A'}
                style={styles.genderIcon}
              />
              <Text style={[styles.genderText, gender === 'other' && styles.genderTextSelected]}>
                OTHER
              </Text>
            </Pressable>
          </View>
        </Animated.View>

        {/* ─── Section 2: AGE ─── */}
        <Animated.View style={[styles.sectionContainer, fadeSlideStyle(ageAnim)]}>
          <Text style={styles.sectionTitle}>AGE</Text>

          {/* Main Age Card */}
          <View style={styles.newAgeCard}>
            <Text style={styles.currentMetricLabel}>CURRENT METRIC</Text>
            <Pressable onPress={handleOpenEditModal} style={styles.ageValuePressable}>
              <Text style={styles.ageValueText}>{age}</Text>
            </Pressable>
            <Text style={styles.triangleIndicator}>▲</Text>

            {/* Interactive Horizontal Scroll Ruler */}
            <View style={styles.newRulerContainer}>
              {/* Center Pointer Indicator */}
              <View style={styles.newCenterPointerWrapper} pointerEvents="none">
                <View style={styles.newCenterYellowLine} />
              </View>

              {/* Smooth ScrollView Ruler */}
              <ScrollView
                ref={ageScrollRef}
                horizontal
                onScrollBeginDrag={() => setScrollEnabled(false)}
                onScrollEndDrag={() => setScrollEnabled(true)}
                onMomentumScrollEnd={() => setScrollEnabled(true)}
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}
                onScroll={handleAgeScroll}
                decelerationRate="fast"
                snapToInterval={TICK_SPACING}
                contentContainerStyle={styles.newRulerScrollContent}
              >
                {Array.from({ length: MAX_AGE - MIN_AGE + 1 }).map((_, i) => {
                  const val = MIN_AGE + i;
                  const isMajor = val % 5 === 0;
                  return (
                    <View key={val} style={[styles.newRulerTickWrapper, { width: TICK_SPACING }]}>
                      <View
                        style={[
                          styles.newRulerTickLine,
                          isMajor ? styles.newRulerTickMajor : styles.newRulerTickMinor,
                        ]}
                      />
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </Animated.View>

      </ScrollView>

      {/* ─── Bottom CTA Button ─── */}
      <Animated.View style={[styles.bottomBar, fadeSlideStyle(buttonAnim)]}>
        <Button
          label="CONTINUE"
          onPress={handleContinue}
          variant="primary"
          style={styles.ctaButton}
          labelStyle={styles.ctaLabel}
        />
      </Animated.View>

      {/* ─── Modern Edit Age Bottom Sheet Modal ─── */}
      <Modal
        visible={isModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsModalOpen(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <Pressable style={styles.modalBackdrop} onPress={() => setIsModalOpen(false)} />
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />

            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>EDIT TEMPORAL AGE</Text>
              <Pressable onPress={() => setIsModalOpen(false)} hitSlop={10}>
                <Feather name="x" size={20} color="#A1A1AA" />
              </Pressable>
            </View>

            <Text style={styles.modalSubtitle}>
              Specify your baseline age within the system bounds ({MIN_AGE} – {MAX_AGE} YRS).
            </Text>

            {/* Stepper & Manual Input Row */}
            <View style={styles.modalInputRow}>
              <Pressable
                onPress={handleDecrement}
                style={styles.stepperButton}
                hitSlop={6}
              >
                <Feather name="minus" size={20} color="#FFFFFF" />
              </Pressable>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.modalTextInput}
                  value={inputAge}
                  onChangeText={(txt) => {
                    setInputAge(txt);
                    setErrorMsg('');
                  }}
                  keyboardType="number-pad"
                  maxLength={3}
                  selectTextOnFocus
                />
                <Text style={styles.modalInputUnit}>YRS</Text>
              </View>

              <Pressable
                onPress={handleIncrement}
                style={styles.stepperButton}
                hitSlop={6}
              >
                <Feather name="plus" size={20} color="#FFFFFF" />
              </Pressable>
            </View>

            {/* Validation Error Message */}
            {!!errorMsg && (
              <View style={styles.errorContainer}>
                <Feather name="alert-circle" size={14} color="#EF4444" />
                <Text style={styles.errorText}>{errorMsg}</Text>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.modalActionRow}>
              <Pressable
                style={styles.modalCancelButton}
                onPress={() => setIsModalOpen(false)}
              >
                <Text style={styles.modalCancelText}>CANCEL</Text>
              </Pressable>

              <Pressable
                style={styles.modalSaveButton}
                onPress={handleSaveAge}
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
    marginBottom: 12,
  },
  description: {
    fontFamily: fontFamilies.regular,
    fontSize: 14,
    lineHeight: 21,
    color: '#8E8E93',
    marginBottom: 32,
  },

  /* ─── Section ─── */
  sectionContainer: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 11,
    letterSpacing: 2,
    color: '#71717A',
    marginBottom: 16,
    textTransform: 'uppercase',
  },

  /* ─── Gender Cards ─── */
  genderRow: {
    flexDirection: 'row',
    gap: 10,
  },
  genderCard: {
    flex: 1,
    height: 116,
    borderRadius: 10,
    backgroundColor: '#0B0B0D',
    borderWidth: 1,
    borderColor: '#1E1E22',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  genderCardSelected: {
    borderColor: colors.accentGold,
    backgroundColor: 'rgba(229, 169, 60, 0.08)',
  },
  genderIcon: {
    marginBottom: 10,
  },
  genderText: {
    fontFamily: fontFamilies.bold,
    fontSize: 13,
    letterSpacing: 1.5,
    color: '#71717A',
  },
  genderTextSelected: {
    color: colors.accentGold,
  },

  /* ─── Temporal Age Section ─── */
  ageTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  ageTitleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  ageTitleIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(229, 169, 60, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(229, 169, 60, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ageTitleText: {
    fontFamily: fontFamilies.bold,
    fontSize: 13,
    letterSpacing: 2.5,
    color: '#D4D4D8',
  },
  ageClassBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(229, 169, 60, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(229, 169, 60, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  ageClassBadgeText: {
    fontFamily: fontFamilies.bold,
    fontSize: 10,
    letterSpacing: 1.5,
    color: colors.accentGold,
  },

  /* New Age Selection Styles */
  newAgeCard: {
    backgroundColor: '#000000',
    alignItems: 'center',
    paddingVertical: 10,
    overflow: 'hidden',
  },
  currentMetricLabel: {
    fontFamily: fontFamilies.bold,
    fontSize: 12,
    letterSpacing: 2,
    color: colors.accentGold,
    marginBottom: 8,
    textAlign: 'center',
  },
  ageValuePressable: {
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  ageValueText: {
    fontFamily: fontFamilies.bold,
    fontSize: 90,
    lineHeight: 100,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '900',
  },
  triangleIndicator: {
    fontSize: 16,
    color: colors.accentGold,
    marginTop: -8,
    marginBottom: 20,
    textAlign: 'center',
  },
  newRulerContainer: {
    backgroundColor: '#000000',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#1E1E22',
    height: 72,
    width: '100%',
    position: 'relative',
    justifyContent: 'center',
  },
  newCenterPointerWrapper: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    transform: [{ translateX: -1.25 }],
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  newCenterYellowLine: {
    width: 2.5,
    height: 48,
    backgroundColor: colors.accentGold,
    borderRadius: 2,
    shadowColor: colors.accentGold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 4,
  },
  newRulerScrollContent: {
    paddingHorizontal: '50%',
    alignItems: 'center',
  },
  newRulerTickWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  newRulerTickLine: {
    width: 1.5,
    borderRadius: 0.75,
  },
  newRulerTickMajor: {
    height: 32,
    backgroundColor: '#52525B',
  },
  newRulerTickMinor: {
    height: 16,
    backgroundColor: '#27272A',
  },

  /* Metabolic Classification Banner */
  ageMetaBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 14,
    backgroundColor: 'rgba(229, 169, 60, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(229, 169, 60, 0.12)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
  },
  ageMetaIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(229, 169, 60, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ageMetaTextWrap: {
    flex: 1,
    gap: 2,
  },
  ageMetaLabel: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 8,
    letterSpacing: 2,
    color: '#71717A',
  },
  ageMetaValue: {
    fontFamily: fontFamilies.bold,
    fontSize: 11,
    letterSpacing: 0.5,
    color: colors.accentGold,
  },
  ageMetaCodeWrap: {
    backgroundColor: 'rgba(229, 169, 60, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(229, 169, 60, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ageMetaCode: {
    fontFamily: fontFamilies.bold,
    fontSize: 10,
    letterSpacing: 1.5,
    color: colors.accentGold,
  },

  /* ─── Terminal Note Box ─── */
  terminalNoteBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.28)',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    gap: 12,
  },
  terminalIconWrapper: {
    marginTop: 2,
  },
  terminalText: {
    flex: 1,
    fontFamily: fontFamilies.medium,
    fontSize: 12,
    lineHeight: 18,
    color: '#94A3B8',
    fontStyle: 'italic',
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
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#27272A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#3F3F46',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 8,
    minWidth: 120,
    justifyContent: 'center',
  },
  modalTextInput: {
    fontFamily: fontFamilies.bold,
    fontSize: 32,
    color: '#FFFFFF',
    textAlign: 'center',
    minWidth: 50,
  },
  modalInputUnit: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 12,
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
    height: 48,
    borderRadius: 10,
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#27272A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: {
    fontFamily: fontFamilies.bold,
    fontSize: 12,
    letterSpacing: 1.5,
    color: '#A1A1AA',
  },
  modalSaveButton: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSaveText: {
    fontFamily: fontFamilies.bold,
    fontSize: 12,
    letterSpacing: 1.5,
    color: '#000000',
  },
});

