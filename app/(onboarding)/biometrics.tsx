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

import { Button } from '@/components/common/Button';
import { Screen } from '@/components/common/Screen';
import { StepIndicator } from '@/components/common/StepIndicator';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

const TOTAL_STEPS = 8;
const CURRENT_STEP = 1; // second step (0-indexed)

const MIN_AGE = 8;
const MAX_AGE = 80;
const AGE_ITEM_HEIGHT = 50;

const AGE_PRESETS = [8, 14, 18, 24, 30, 45, 60];

const getMetabolicClassification = (currentAge: number) => {
  if (currentAge < 18) return { label: 'NEURAL GROWTH BASELINE', code: 'VEC-01' };
  if (currentAge < 30) return { label: 'PRIME VECTOR (OPTIMAL RECOVERY)', code: 'VEC-02' };
  if (currentAge < 46) return { label: 'VETERAN ADAPTATION', code: 'VEC-03' };
  return { label: 'APEX MASTERY PARAMETERS', code: 'VEC-04' };
};

export default function BiometricsScreen() {
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [age, setAge] = useState(24);

  const wheelItems = [
    null,
    null,
    ...Array.from({ length: MAX_AGE - MIN_AGE + 1 }, (_, i) => MIN_AGE + i),
    null,
    null,
  ];

  // Edit Age Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputAge, setInputAge] = useState('24');
  const [errorMsg, setErrorMsg] = useState('');

  const ageScrollRef = useRef<ScrollView>(null);

  // Animations
  const headerAnim = useRef(new Animated.Value(0)).current;
  const genderAnim = useRef(new Animated.Value(0)).current;
  const ageAnim = useRef(new Animated.Value(0)).current;
  const noteAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

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

    // Scroll Age ruler to initial value (24)
    setTimeout(() => {
      const initialY = (24 - MIN_AGE) * AGE_ITEM_HEIGHT;
      ageScrollRef.current?.scrollTo({ y: initialY, animated: false });
    }, 100);
  }, [headerAnim, genderAnim, ageAnim, noteAnim, buttonAnim]);

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
    // Navigate to step 3: physical profile
    router.push('/(onboarding)/physical-profile');
  };

  const handleAgeScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const computedAge = Math.round(MIN_AGE + offsetY / AGE_ITEM_HEIGHT);
    const clampedAge = Math.max(MIN_AGE, Math.min(MAX_AGE, computedAge));
    if (clampedAge !== age) {
      setAge(clampedAge);
    }
  };

  const handleSelectAge = (newAge: number) => {
    const clamped = Math.max(MIN_AGE, Math.min(MAX_AGE, newAge));
    setAge(clamped);
    setTimeout(() => {
      const targetY = (clamped - MIN_AGE) * AGE_ITEM_HEIGHT;
      ageScrollRef.current?.scrollTo({ y: targetY, animated: true });
    }, 50);
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
      const targetY = (parsed - MIN_AGE) * AGE_ITEM_HEIGHT;
      ageScrollRef.current?.scrollTo({ y: targetY, animated: true });
    }, 150);
  };

  const handleIncrement = () => {
    const parsed = parseInt(inputAge, 10) || age;
    if (parsed < MAX_AGE) {
      const next = parsed + 1;
      setInputAge(next.toString());
      if (next >= MIN_AGE && next <= MAX_AGE) setErrorMsg('');
    }
  };

  const handleDecrement = () => {
    const parsed = parseInt(inputAge, 10) || age;
    if (parsed > MIN_AGE) {
      const prev = parsed - 1;
      setInputAge(prev.toString());
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
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Title Header */}
        <Animated.View style={fadeSlideStyle(headerAnim)}>
          <Text style={styles.title}>Tell us about yourself</Text>
          <Text style={styles.description}>
            Your genetic profile and temporal age form your baseline.{"\n"}Specify these details to calibrate your potential.
          </Text>
        </Animated.View>

        {/* ─── Section 1: GENETIC PROFILE ─── */}
        <Animated.View style={[styles.sectionContainer, fadeSlideStyle(genderAnim)]}>
          <Text style={styles.sectionTitle}>GENETIC PROFILE</Text>
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

        {/* ─── Section 2: TEMPORAL AGE ─── */}
        <Animated.View style={[styles.sectionContainer, fadeSlideStyle(ageAnim)]}>
          {/* Section Title Row */}
          <View style={styles.ageTitleRow}>
            <View style={styles.ageTitleLeft}>
              <View style={styles.ageTitleIcon}>
                <MaterialCommunityIcons name="clock-fast" size={18} color={colors.accentGold} />
              </View>
              <Text style={styles.ageTitleText}>TEMPORAL AGE</Text>
            </View>
            <View style={styles.ageClassBadge}>
              <Ionicons name="sparkles" size={10} color={colors.accentGold} />
              <Text style={styles.ageClassBadgeText}>{getMetabolicClassification(age).code}</Text>
            </View>
          </View>

          {/* Main Age Card */}
          {/* Main Age Card */}
          <View style={styles.ageCard}>
            {/* Glowing top accent line */}
            <View style={styles.ageCardTopAccent} />

            {/* The Vertical Wheel Picker */}
            <View style={styles.wheelContainer}>
              {/* Highlight selection box */}
              <View style={styles.wheelHighlightBox} pointerEvents="none" />

              <ScrollView
                ref={ageScrollRef}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
                onScroll={handleAgeScroll}
                decelerationRate="fast"
                snapToInterval={50}
                contentContainerStyle={styles.wheelScrollContent}
              >
                {wheelItems.map((val, index) => {
                  if (val === null) {
                    return <View key={`empty-${index}`} style={{ height: 50 }} />;
                  }

                  const isSelected = val === age;
                  const distance = Math.abs(val - age);
                  let itemTextStyle: any = styles.wheelTextMuted;

                  if (distance === 0) {
                    itemTextStyle = styles.wheelTextActive;
                  } else if (distance === 1) {
                    itemTextStyle = styles.wheelTextMedium;
                  }

                  return (
                    <Pressable
                      key={val}
                      style={styles.wheelItem}
                      onPress={isSelected ? handleOpenEditModal : () => handleSelectAge(val)}
                    >
                      <View style={styles.wheelItemRow}>
                        <Text style={itemTextStyle}>{val}</Text>
                        {distance === 0 && <Text style={styles.wheelUnitText}> YRS</Text>}
                      </View>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>

            {/* Stepper Controls */}
            <View style={styles.ageStepperRow}>
              <Pressable
                onPress={() => handleSelectAge(age - 5)}
                disabled={age <= MIN_AGE}
                style={[styles.ageStepBtn, styles.ageStepBtnLarge, age <= MIN_AGE && styles.ageStepBtnDisabled]}
                hitSlop={6}
              >
                <Text style={[styles.ageStepBtnText, age <= MIN_AGE && styles.ageStepBtnTextDisabled]}>−5</Text>
              </Pressable>
              <Pressable
                onPress={() => handleSelectAge(age - 1)}
                disabled={age <= MIN_AGE}
                style={[styles.ageStepBtn, age <= MIN_AGE && styles.ageStepBtnDisabled]}
                hitSlop={6}
              >
                <Feather name="minus" size={18} color={age <= MIN_AGE ? '#3F3F46' : '#FFFFFF'} />
              </Pressable>

              <View style={styles.ageStepDivider} />

              <Pressable
                onPress={() => handleSelectAge(age + 1)}
                disabled={age >= MAX_AGE}
                style={[styles.ageStepBtn, age >= MAX_AGE && styles.ageStepBtnDisabled]}
                hitSlop={6}
              >
                <Feather name="plus" size={18} color={age >= MAX_AGE ? '#3F3F46' : '#FFFFFF'} />
              </Pressable>
              <Pressable
                onPress={() => handleSelectAge(age + 5)}
                disabled={age >= MAX_AGE}
                style={[styles.ageStepBtn, styles.ageStepBtnLarge, age >= MAX_AGE && styles.ageStepBtnDisabled]}
                hitSlop={6}
              >
                <Text style={[styles.ageStepBtnText, age >= MAX_AGE && styles.ageStepBtnTextDisabled]}>+5</Text>
              </Pressable>
            </View>

            {/* Quick Age Presets */}
            <View style={styles.agePresetsContainer}>
              <Text style={styles.agePresetsLabel}>QUICK SELECT</Text>
              <View style={styles.agePresetsGrid}>
                {AGE_PRESETS.map((presetVal) => {
                  const isActive = age === presetVal;
                  return (
                    <Pressable
                      key={presetVal}
                      onPress={() => handleSelectAge(presetVal)}
                      style={[styles.agePresetChip, isActive && styles.agePresetChipActive]}
                    >
                      <Text style={[styles.agePresetChipText, isActive && styles.agePresetChipTextActive]}>
                        {presetVal}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
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

  /* Age Card */
  ageCard: {
    backgroundColor: '#0A0A0C',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1A1A1F',
    paddingVertical: 24,
    paddingHorizontal: 20,
    overflow: 'hidden',
  },
  ageCardTopAccent: {
    position: 'absolute',
    top: 0,
    left: 40,
    right: 40,
    height: 2,
    backgroundColor: colors.accentGold,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    shadowColor: colors.accentGold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 6,
  },

  /* Wheel Selection */
  wheelContainer: {
    height: 250,
    backgroundColor: '#060608',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#18181C',
    position: 'relative',
    marginBottom: 24,
    overflow: 'hidden',
  },
  wheelHighlightBox: {
    position: 'absolute',
    top: 100,
    left: 12,
    right: 12,
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(229, 169, 60, 0.3)',
    backgroundColor: 'rgba(229, 169, 60, 0.06)',
  },
  wheelScrollContent: {
    paddingVertical: 0,
  },
  wheelItem: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheelItemRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  wheelTextActive: {
    fontFamily: fontFamilies.bold,
    fontSize: 32,
    color: colors.accentGold,
  },
  wheelTextMedium: {
    fontFamily: fontFamilies.medium,
    fontSize: 22,
    color: '#D4D4D8',
    opacity: 0.5,
  },
  wheelTextMuted: {
    fontFamily: fontFamilies.regular,
    fontSize: 16,
    color: '#71717A',
    opacity: 0.2,
  },
  wheelUnitText: {
    fontFamily: fontFamilies.bold,
    fontSize: 12,
    color: colors.accentGold,
    marginLeft: 4,
    letterSpacing: 1,
  },

  /* Stepper Row */
  ageStepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
  },
  ageStepBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#111114',
    borderWidth: 1,
    borderColor: '#27272A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ageStepBtnLarge: {
    width: 52,
    backgroundColor: '#0E0E11',
    borderColor: '#222226',
  },
  ageStepBtnDisabled: {
    opacity: 0.3,
    borderColor: '#18181B',
  },
  ageStepBtnText: {
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    color: '#FFFFFF',
  },
  ageStepBtnTextDisabled: {
    color: '#3F3F46',
  },
  ageStepDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#27272A',
    marginHorizontal: 4,
  },

  /* Age Presets */
  agePresetsContainer: {
    gap: 10,
  },
  agePresetsLabel: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 9,
    letterSpacing: 2,
    color: '#52525B',
  },
  agePresetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  agePresetChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#111114',
    borderWidth: 1,
    borderColor: '#222226',
  },
  agePresetChipActive: {
    backgroundColor: colors.accentGold,
    borderColor: colors.accentGold,
    shadowColor: colors.accentGold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  agePresetChipText: {
    fontFamily: fontFamilies.bold,
    fontSize: 13,
    color: '#A1A1AA',
  },
  agePresetChipTextActive: {
    color: '#000000',
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

