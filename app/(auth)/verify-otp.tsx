import { useEffect, useRef, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import {
  Animated,
  Easing,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

import { Button } from '@/components/common/Button';
import { DustParticles } from '@/components/common/DustParticles';
import { verifyOtp, resendOtp } from '@/services/api/auth.service';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';
import { useOnboardingStore } from '@/store/useOnboardingStore';

const OTP_LENGTH = 6;
const easeOutCubic = Easing.out(Easing.cubic);

export default function VerifyOtpScreen() {
  const { email, fromSignup } = useLocalSearchParams<{ email: string; fromSignup?: string }>();
  const setVerifiedEmail = useOnboardingStore((s) => s.setVerifiedEmail);
  const [code, setCode] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Timer states
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Hidden TextInput reference
  const inputRef = useRef<TextInput>(null);

  // Animations
  const contentAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animations
    Animated.stagger(150, [
      Animated.timing(contentAnim, {
        toValue: 1,
        duration: 800,
        easing: easeOutCubic,
        useNativeDriver: true,
      }),
      Animated.timing(buttonAnim, {
        toValue: 1,
        duration: 800,
        easing: easeOutCubic,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-focus hidden input on mount
    setTimeout(() => {
      inputRef.current?.focus();
    }, 400);
  }, []);

  // Timer tick effect
  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const fadeSlideStyle = (anim: Animated.Value) => ({
    opacity: anim,
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [30, 0],
        }),
      },
    ],
  });

  const handleVerify = async () => {
    if (code.length < OTP_LENGTH) return;
    setError(null);
    setLoading(true);

    try {
      await verifyOtp(email || '', code);
      if (email) {
        setVerifiedEmail(email);
      }
      if (fromSignup === 'true') {
        router.back();
      } else {
        router.replace('/(onboarding)/ascension');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
      setCode(''); // reset code on fail
      inputRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setError(null);
    setCanResend(false);
    setTimer(60);

    try {
      await resendOtp(email || '');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend code');
    }
  };

  const handleCodeChange = (text: string) => {
    // Only allow numbers
    const cleanText = text.replace(/[^0-9]/g, '');
    setCode(cleanText);

    // Auto-submit when complete
    if (cleanText.length === OTP_LENGTH) {
      Keyboard.dismiss();
    }
  };

  // Render individual code slot boxes
  const renderSlots = () => {
    const slots = [];
    for (let i = 0; i < OTP_LENGTH; i++) {
      const char = code[i] || '';
      const isSlotFocused = isFocused && code.length === i;

      slots.push(
        <Pressable
          key={i}
          style={[
            styles.slotBox,
            char.length > 0 && styles.slotBoxFilled,
            isSlotFocused && styles.slotBoxFocused,
          ]}
          onPress={() => inputRef.current?.focus()}
        >
          <Text style={[styles.slotText, isSlotFocused && styles.slotTextFocused]}>
            {char}
          </Text>
          {isSlotFocused && <View style={styles.focusCursor} />}
        </Pressable>
      );
    }
    return slots;
  };

  return (
    <View style={styles.container}>
      <DustParticles count={20} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back Navigation Arrow */}
          <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backButton}>
            <Feather name="arrow-left" size={22} color="#FFFFFF" />
          </Pressable>

          <Animated.View style={[styles.mainContent, fadeSlideStyle(contentAnim)]}>
            {/* Locked Shield Header Icon */}
            <View style={styles.iconCircle}>
              <Feather name="shield" size={24} color={colors.accentGold} />
            </View>

            <Text style={styles.sectionLabel}>VERIFY IDENTITY</Text>
            <Text style={styles.title}>Confirm your sign</Text>
            <Text style={styles.description}>
              We sent a 6-digit access code to{' '}
              <Text style={styles.emailHighlight}>{email || 'your email'}</Text>. Enter it below to unlock the oath gate.
            </Text>

            {/* Hidden Input field */}
            <TextInput
              ref={inputRef}
              style={styles.hiddenInput}
              value={code}
              onChangeText={handleCodeChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              keyboardType="number-pad"
              maxLength={OTP_LENGTH}
              textContentType="oneTimeCode"
              autoComplete="one-time-code"
            />

            {/* Styled Pin Slot Row */}
            <View style={styles.slotsRow}>{renderSlots()}</View>

            {/* Error Message */}
            {error && (
              <View style={styles.errorContainer}>
                <Feather name="alert-circle" size={14} color="#EF4444" style={{ marginRight: 6 }} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Resend Code Section */}
            <View style={styles.resendContainer}>
              {timer > 0 ? (
                <Text style={styles.timerText}>
                  Resend code in <Text style={styles.timerBold}>{timer}s</Text>
                </Text>
              ) : (
                <View style={styles.resendRow}>
                  <Text style={styles.resendPrefix}>Didn't receive it? </Text>
                  <Pressable onPress={handleResend}>
                    <Text style={styles.resendLink}>Resend Code</Text>
                  </Pressable>
                </View>
              )}
            </View>
          </Animated.View>
        </ScrollView>

        {/* CTA Verify Button at the Bottom */}
        <Animated.View style={[styles.bottomBar, fadeSlideStyle(buttonAnim)]}>
          <Button
            label="VERIFY CODE"
            onPress={handleVerify}
            loading={loading}
            disabled={code.length < OTP_LENGTH}
            variant="primary"
            style={styles.ctaButton}
            labelStyle={styles.ctaLabel}
          />
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 44 : 20,
    paddingBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  mainContent: {
    alignItems: 'center',
    paddingTop: 16,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#26262B',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#141416',
    marginBottom: 24,
  },
  sectionLabel: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 11,
    letterSpacing: 3,
    color: colors.accentGold,
    marginBottom: 12,
  },
  title: {
    fontFamily: fontFamilies.bold,
    fontSize: 28,
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontFamily: fontFamilies.regular,
    fontSize: 14,
    lineHeight: 20,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 36,
    paddingHorizontal: 12,
  },
  emailHighlight: {
    fontFamily: fontFamilies.medium,
    color: '#FFFFFF',
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 0,
    height: 0,
  },
  slotsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 8,
    marginBottom: 24,
  },
  slotBox: {
    width: 48,
    height: 56,
    borderRadius: 10,
    backgroundColor: '#141416',
    borderWidth: 1,
    borderColor: '#26262B',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  slotBoxFilled: {
    borderColor: '#3F3F46',
  },
  slotBoxFocused: {
    borderColor: colors.accentGold,
    backgroundColor: '#1A1A1E',
  },
  slotText: {
    fontFamily: fontFamilies.bold,
    fontSize: 22,
    color: '#E4E4E7',
  },
  slotTextFocused: {
    color: colors.accentGold,
  },
  focusCursor: {
    position: 'absolute',
    width: 2,
    height: 20,
    backgroundColor: colors.accentGold,
    borderRadius: 1,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 24,
    width: '100%',
  },
  errorText: {
    fontFamily: fontFamilies.regular,
    fontSize: 13,
    color: '#EF4444',
  },
  resendContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  timerText: {
    fontFamily: fontFamilies.regular,
    fontSize: 14,
    color: '#71717A',
  },
  timerBold: {
    fontFamily: fontFamilies.medium,
    color: colors.accentGold,
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resendPrefix: {
    fontFamily: fontFamilies.regular,
    fontSize: 14,
    color: '#71717A',
  },
  resendLink: {
    fontFamily: fontFamilies.medium,
    fontSize: 14,
    color: '#FFFFFF',
    textDecorationLine: 'underline',
  },
  bottomBar: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 24 : 28,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    backgroundColor: '#0A0A0A',
  },
  ctaButton: {
    height: 56,
    borderRadius: 12,
  },
  ctaLabel: {
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    letterSpacing: 2,
  },
});
