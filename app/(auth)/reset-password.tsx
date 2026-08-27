import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';
import { resetPassword } from '@/services/api/auth.service';

const easeOut = Easing.out(Easing.cubic);

// ── Password requirements ────────────────────────────────────────────────────
const REQUIREMENTS = [
  { key: 'length',    label: 'AT LEAST 8 CHARACTERS',  test: (p: string) => p.length >= 8 },
  { key: 'upper',     label: 'ONE UPPERCASE LETTER',    test: (p: string) => /[A-Z]/.test(p) },
  { key: 'number',    label: 'ONE NUMBER',              test: (p: string) => /[0-9]/.test(p) },
  { key: 'special',   label: 'ONE SPECIAL CHARACTER',   test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

// ── Animated requirement row ─────────────────────────────────────────────────
function Requirement({ label, met }: { label: string; met: boolean }) {
  // Only animate opacity + scale — these work with useNativeDriver: true on web
  const checkOpacity = useRef(new Animated.Value(0)).current;
  const checkScale   = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(checkOpacity, {
        toValue: met ? 1 : 0,
        duration: 220,
        easing: easeOut,
        useNativeDriver: true,
      }),
      Animated.timing(checkScale, {
        toValue: met ? 1 : 0.4,
        duration: 220,
        easing: easeOut,
        useNativeDriver: true,
      }),
    ]).start();
  }, [met]);

  return (
    <View style={reqStyles.row}>
      {/* Circle — color via conditional style, not animated color interpolation */}
      <View style={[reqStyles.circle, met && reqStyles.circleMet]}>
        <Animated.View
          style={{
            opacity: checkOpacity,
            transform: [{ scale: checkScale }],
          }}
        >
          <Feather name="check" size={9} color="#000000" />
        </Animated.View>
      </View>
      {/* Label — color via conditional style */}
      <Text style={[reqStyles.label, met && reqStyles.labelMet]}>
        {label}
      </Text>
    </View>
  );
}

const reqStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  circle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#3A3A3E',
    backgroundColor: '#2A2A2E',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  circleMet: {
    borderColor: colors.accentGold,
    backgroundColor: colors.accentGold,
  },
  label: {
    fontFamily: fontFamilies.regular,
    fontSize: 12,
    letterSpacing: 0.8,
    color: '#52525B',
  },
  labelMet: {
    color: '#FFFFFF',
  },
});


// ── Main Screen ──────────────────────────────────────────────────────────────
export default function ResetPasswordScreen() {
  const { height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const [newPassword,     setNewPassword]     = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew,         setShowNew]         = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [focusedField,    setFocusedField]    = useState<'new' | 'confirm' | null>(null);
  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState<string | null>(null);

  const { token } = useLocalSearchParams<{ token: string }>();

  // Animation values
  const bgOp       = useRef(new Animated.Value(0)).current;
  const backOp     = useRef(new Animated.Value(0)).current;
  const cardOp     = useRef(new Animated.Value(0)).current;
  const cardY      = useRef(new Animated.Value(32)).current;
  const tagOp      = useRef(new Animated.Value(0)).current;
  const tagY       = useRef(new Animated.Value(14)).current;
  const titleOp    = useRef(new Animated.Value(0)).current;
  const titleY     = useRef(new Animated.Value(18)).current;
  const fieldsOp   = useRef(new Animated.Value(0)).current;
  const fieldsY    = useRef(new Animated.Value(14)).current;
  const reqOp      = useRef(new Animated.Value(0)).current;
  const reqY       = useRef(new Animated.Value(10)).current;
  const btnOp      = useRef(new Animated.Value(0)).current;
  const btnY       = useRef(new Animated.Value(16)).current;
  const btnScale   = useRef(new Animated.Value(0.98)).current;
  const pressScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const t = (val: Animated.Value, to: number, dur: number, delay: number) =>
      Animated.timing(val, { toValue: to, duration: dur, delay, easing: easeOut, useNativeDriver: true });

    Animated.parallel([
      t(bgOp,    1, 500, 0),
      t(backOp,  1, 400, 0),
      t(cardOp,  1, 600, 60),
      t(cardY,   0, 600, 60),
      t(tagOp,   1, 450, 200),
      t(tagY,    0, 450, 200),
      t(titleOp, 1, 500, 300),
      t(titleY,  0, 500, 300),
      t(fieldsOp,1, 480, 420),
      t(fieldsY, 0, 480, 420),
      t(reqOp,   1, 420, 540),
      t(reqY,    0, 420, 540),
      t(btnOp,   1, 450, 650),
      t(btnY,    0, 450, 650),
      t(btnScale,1, 450, 650),
    ]).start();
  }, []);

  const requirements = REQUIREMENTS.map(r => ({ ...r, met: r.test(newPassword) }));
  const allMet       = requirements.every(r => r.met);
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;
  const canSubmit    = allMet && passwordsMatch;

  const handleSetPassword = async () => {
    if (!canSubmit) return;
    setError(null);
    setLoading(true);
    try {
      await resetPassword(token || '', newPassword, confirmPassword);
      router.replace('/(auth)/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onPressIn = () =>
    Animated.timing(pressScale, { toValue: 0.98, duration: 120, easing: easeOut, useNativeDriver: true }).start();
  const onPressOut = () =>
    Animated.timing(pressScale, { toValue: 1, duration: 180, easing: easeOut, useNativeDriver: true }).start();

  // Vertical card top offset — more space below the back arrow
  const cardTopOffset = screenHeight * 0.20;

  return (
    <Animated.View style={[styles.container, { opacity: bgOp }]}>
      {/* Back button */}
      <Animated.View style={[styles.backWrapper, { top: insets.top + 10, opacity: backOp }]}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color="#FFFFFF" />
        </Pressable>
      </Animated.View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingTop: cardTopOffset }]}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Card ──────────────────────────────────────────────────── */}
          <Animated.View
            style={[
              styles.card,
              { opacity: cardOp, transform: [{ translateY: cardY }] },
            ]}
          >
            {/* Tag */}
            <Animated.Text
              style={[styles.tag, { opacity: tagOp, transform: [{ translateY: tagY }] }]}
            >
              RESET PASSWORD
            </Animated.Text>

            {/* Title */}
            <Animated.Text
              style={[styles.title, { opacity: titleOp, transform: [{ translateY: titleY }] }]}
            >
              SECURE YOUR{'\n'}ACCOUNT
            </Animated.Text>

            {/* ── Fields ──────────────────────────────────────────────── */}
            <Animated.View
              style={{ opacity: fieldsOp, transform: [{ translateY: fieldsY }] }}
            >
              {/* New Password */}
              <Text style={styles.fieldLabel}>NEW PASSWORD</Text>
              <View
                style={[
                  styles.inputWrapper,
                  focusedField === 'new' && styles.inputFocused,
                ]}
              >
                <Feather
                  name="lock"
                  size={18}
                  color={focusedField === 'new' ? colors.accentGold : '#71717A'}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#52525B"
                  secureTextEntry={!showNew}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  onFocus={() => setFocusedField('new')}
                  onBlur={() => setFocusedField(null)}
                  autoCapitalize="none"
                  autoCorrect={false}
                  {...(Platform.OS === 'web' ? { outlineStyle: 'none' } as any : {})}
                />
                <Pressable onPress={() => setShowNew(v => !v)} hitSlop={8} style={styles.eyeBtn}>
                  <Feather
                    name={showNew ? 'eye-off' : 'eye'}
                    size={18}
                    color={focusedField === 'new' ? colors.accentGold : '#71717A'}
                  />
                </Pressable>
              </View>

              {/* Confirm Password */}
              <Text style={[styles.fieldLabel, { marginTop: 16 }]}>CONFIRM PASSWORD</Text>
              <View
                style={[
                  styles.inputWrapper,
                  focusedField === 'confirm' && styles.inputFocused,
                  confirmPassword.length > 0 && !passwordsMatch && styles.inputError,
                ]}
              >
                <Feather
                  name="lock"
                  size={18}
                  color={focusedField === 'confirm' ? colors.accentGold : '#71717A'}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#52525B"
                  secureTextEntry={!showConfirm}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  onFocus={() => setFocusedField('confirm')}
                  onBlur={() => setFocusedField(null)}
                  autoCapitalize="none"
                  autoCorrect={false}
                  {...(Platform.OS === 'web' ? { outlineStyle: 'none' } as any : {})}
                />
                <Pressable onPress={() => setShowConfirm(v => !v)} hitSlop={8} style={styles.eyeBtn}>
                  <Feather
                    name={showConfirm ? 'eye-off' : 'eye'}
                    size={18}
                    color={focusedField === 'confirm' ? colors.accentGold : '#71717A'}
                  />
                </Pressable>
              </View>

              {confirmPassword.length > 0 && !passwordsMatch && (
                <Text style={styles.errorText}>Passwords do not match</Text>
              )}
            </Animated.View>

            {/* ── Requirements ────────────────────────────────────────── */}
            <Animated.View
              style={[
                styles.requirementsContainer,
                { opacity: reqOp, transform: [{ translateY: reqY }] },
              ]}
            >
              {requirements.map(r => (
                <Requirement key={r.key} label={r.label} met={r.met} />
              ))}
            </Animated.View>

            {/* ── Error Banner ─────────────────────────────────────────── */}
            {error ? (
              <View style={styles.errorBanner}>
                <Feather name="alert-circle" size={14} color="#EF4444" style={{ marginRight: 8 }} />
                <Text style={styles.bannerErrorText}>{error}</Text>
              </View>
            ) : null}

            {/* ── Submit Button ────────────────────────────────────────── */}
            <Animated.View
              style={{
                opacity: btnOp,
                transform: [
                  { translateY: btnY },
                  { scale: btnScale },
                  { scale: pressScale },
                ],
              }}
            >
              <Pressable
                onPress={handleSetPassword}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                disabled={!canSubmit || loading}
                style={[styles.submitBtn, (!canSubmit || loading) && styles.submitBtnDisabled]}
              >
                <Text style={[styles.submitLabel, (!canSubmit || loading) && styles.submitLabelDisabled]}>
                  {loading ? 'UPDATING…' : 'SET NEW PASSWORD'}
                </Text>
              </Pressable>
            </Animated.View>
          </Animated.View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    flexGrow: 1,
  },

  // Back button
  backWrapper: {
    position: 'absolute',
    left: 20,
    zIndex: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Card
  card: {
    backgroundColor: '#0E0E10',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1C1C1E',
    padding: 24,
  },

  // Tag — matches forgot-password tagText
  tag: {
    fontFamily: fontFamilies.bold,
    fontSize: 11,
    letterSpacing: 2.2,
    color: colors.accentGold,
    textTransform: 'uppercase',
    marginBottom: 4,
  },

  // Title — matches forgot-password titleText
  title: {
    fontFamily: fontFamilies.bold,
    fontSize: 28,
    letterSpacing: -0.4,
    color: '#FFFFFF',
    lineHeight: 36,
    marginBottom: 8,
  },

  // Subtitle below title — matches forgot-password subtitleText style
  subtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
    marginTop: 0,
    marginBottom: 24,
  },

  // Field label — matches forgot-password label style
  fieldLabel: {
    fontFamily: fontFamilies.bold,
    fontSize: 11,
    letterSpacing: 1.6,
    color: '#71717A',
    textTransform: 'uppercase',
    marginBottom: 8,
  },

  // Input — matches login page exactly
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0C0C0E',
    borderWidth: 1,
    borderColor: '#26262B',
    borderRadius: 8,
    height: 52,
    paddingHorizontal: 16,
    marginBottom: 0,
  },
  inputFocused: {
    borderColor: colors.accentGold,
  },
  inputError: {
    borderColor: '#FF4D6D44',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontFamily: fontFamilies.regular,
    fontSize: 14,
    backgroundColor: 'transparent',
    ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : {}),
  },
  eyeBtn: {
    marginLeft: 12,
  },
  errorText: {
    fontFamily: fontFamilies.regular,
    fontSize: 11,
    color: '#FF4D6D',
    marginTop: 6,
    letterSpacing: 0.3,
  },

  // Requirements
  requirementsContainer: {
    marginTop: 24,
    marginBottom: 28,
  },

  // Submit button
  submitBtn: {
    height: 54,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnDisabled: {
    backgroundColor: '#1C1C1E',
  },
  submitLabel: {
    fontFamily: fontFamilies.bold,
    fontSize: 13,
    letterSpacing: 2,
    color: '#000000',
  },
  submitLabelDisabled: {
    color: '#3A3A3E',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  bannerErrorText: {
    fontFamily: fontFamilies.regular,
    fontSize: 13,
    color: '#EF4444',
    flex: 1,
  },
});
