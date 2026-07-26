import { useEffect, useRef, useState } from 'react';
import { router } from 'expo-router';
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
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

const MIN_AGE = 14;
const MAX_AGE = 80;
const AGE_TICK_SPACING = 24;

export default function BiometricsScreen() {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState(24);

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
      const initialX = (24 - MIN_AGE) * AGE_TICK_SPACING;
      ageScrollRef.current?.scrollTo({ x: initialX, animated: false });
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
    const offsetX = event.nativeEvent.contentOffset.x;
    const computedAge = Math.round(MIN_AGE + offsetX / AGE_TICK_SPACING);
    const clampedAge = Math.max(MIN_AGE, Math.min(MAX_AGE, computedAge));
    if (clampedAge !== age) {
      setAge(clampedAge);
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
          <Text style={styles.sublabel}>STEP 01.5: BIOMETRIC BASELINE</Text>
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
              {gender === 'male' && <View style={styles.cornerAccent} />}
              <Ionicons
                name="male"
                size={34}
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
              {gender === 'female' && <View style={styles.cornerAccent} />}
              <Ionicons
                name="female"
                size={34}
                color={gender === 'female' ? colors.accentGold : '#71717A'}
                style={styles.genderIcon}
              />
              <Text style={[styles.genderText, gender === 'female' && styles.genderTextSelected]}>
                FEMALE
              </Text>
            </Pressable>
          </View>
        </Animated.View>

        {/* ─── Section 2: TEMPORAL AGE ─── */}
        <Animated.View style={[styles.sectionContainer, fadeSlideStyle(ageAnim)]}>
          <View style={styles.headerRow}>
            <View style={styles.iconBox}>
              <MaterialCommunityIcons name="clock-outline" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.sectionLabel}>TEMPORAL AGE</Text>
            <View style={styles.valueWrapper}>
              <Text style={styles.goldValue}>{age}</Text>
              <Text style={styles.unitText}>YRS</Text>
            </View>
          </View>

          {/* Interactive Age Scroll Ruler */}
          <View style={styles.rulerContainer}>
            {/* Center Yellow Line Pointer */}
            <View style={styles.centerPointerWrapper} pointerEvents="none">
              <View style={styles.centerYellowLine} />
              <Text style={styles.centerValueText}>{age}</Text>
            </View>

            <ScrollView
              ref={ageScrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={16}
              onScroll={handleAgeScroll}
              decelerationRate="fast"
              snapToInterval={AGE_TICK_SPACING}
              contentContainerStyle={styles.ageScrollContent}
            >
              {Array.from({ length: MAX_AGE - MIN_AGE + 1 }).map((_, i) => {
                const val = MIN_AGE + i;
                const isSelected = val === age;
                const isMajor = val % 5 === 0;
                return (
                  <View key={val} style={[styles.ageTickItem, { width: AGE_TICK_SPACING }]}>
                    <View
                      style={[
                        styles.ageTickLine,
                        isSelected
                          ? styles.ageTickLineSelected
                          : isMajor
                          ? styles.ageTickLineMajor
                          : styles.ageTickLineMinor,
                      ]}
                    />
                    {isMajor ? (
                      <Text style={[styles.ageTickNumber, isSelected && styles.ageTickNumberSelected]}>
                        {val}
                      </Text>
                    ) : (
                      <Text style={styles.ageTickEmpty}></Text>
                    )}
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </Animated.View>

        {/* ─── Section 3: System Terminal Note Box ─── */}
        <Animated.View style={[styles.terminalNoteBox, fadeSlideStyle(noteAnim)]}>
          <View style={styles.terminalIconWrapper}>
            <Feather name="terminal" size={16} color="#3B82F6" />
          </View>
          <Text style={styles.terminalText}>
            Physical identity established as the primary vector for Hunter optimization. Calibrating
            metabolic thresholds based on input parameters...
          </Text>
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
    marginBottom: 6,
  },
  sublabel: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 11,
    letterSpacing: 2,
    color: '#71717A',
    marginBottom: 28,
    textTransform: 'uppercase',
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

  /* ─── Header Row ─── */
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

  /* ─── Gender Cards ─── */
  genderRow: {
    flexDirection: 'row',
    gap: 14,
  },
  genderCard: {
    flex: 1,
    height: 124,
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
  cornerAccent: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 6,
    height: 6,
    backgroundColor: colors.accentGold,
    borderRadius: 1,
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

  /* ─── Age Section ─── */
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
  ageScrollContent: {
    paddingHorizontal: '50%',
    alignItems: 'center',
    paddingTop: 14,
  },
  ageTickItem: {
    alignItems: 'center',
  },
  ageTickLine: {
    width: 1,
    borderRadius: 0.5,
  },
  ageTickLineMinor: {
    height: 10,
    backgroundColor: '#27272A',
  },
  ageTickLineMajor: {
    height: 18,
    backgroundColor: '#52525B',
  },
  ageTickLineSelected: {
    height: 0,
  },
  ageTickNumber: {
    fontFamily: fontFamilies.regular,
    fontSize: 11,
    color: '#52525B',
    marginTop: 10,
  },
  ageTickNumberSelected: {
    opacity: 0,
  },
  ageTickEmpty: {
    fontSize: 11,
    marginTop: 10,
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
});

