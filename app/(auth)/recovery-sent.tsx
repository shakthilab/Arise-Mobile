import { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Linking,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { fontFamilies } from '@/theme/typography';

const easeOutCubic = Easing.out(Easing.cubic);

export default function RecoverySentScreen() {
  const { height: screenHeight } = useWindowDimensions();
  // Icon starts at 28% from top of the screen, matching the reference image
  const iconTopOffset = screenHeight * 0.28;

  // ── Animation values ────────────────────────────────────────────────────
  const bgOpacity   = useRef(new Animated.Value(0)).current;
  const iconOpacity = useRef(new Animated.Value(0)).current;
  const iconScale   = useRef(new Animated.Value(0.85)).current;
  const iconY       = useRef(new Animated.Value(12)).current;
  const headingOp   = useRef(new Animated.Value(0)).current;
  const headingY    = useRef(new Animated.Value(18)).current;
  const descOp      = useRef(new Animated.Value(0)).current;
  const descY       = useRef(new Animated.Value(14)).current;
  const btnOp       = useRef(new Animated.Value(0)).current;
  const btnY        = useRef(new Animated.Value(16)).current;
  const btnScale    = useRef(new Animated.Value(0.98)).current;
  const secOp       = useRef(new Animated.Value(0)).current;
  const backOp      = useRef(new Animated.Value(0)).current;

  // Press scale refs
  const primaryPressScale   = useRef(new Animated.Value(1)).current;
  const secondaryPressScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const t = (
      value: Animated.Value,
      toValue: number,
      duration: number,
      delay: number,
      easing = easeOutCubic,
    ) =>
      Animated.timing(value, {
        toValue,
        duration,
        delay,
        easing,
        useNativeDriver: true,
      });

    Animated.parallel([
      // Background
      t(bgOpacity,   1, 500, 0),
      t(backOp,      1, 400, 0),
      // Icon
      t(iconOpacity, 1, 700, 0),
      t(iconScale,   1, 700, 0),
      t(iconY,       0, 700, 0),
      // Heading
      t(headingOp, 1, 500, 150),
      t(headingY,  0, 500, 150),
      // Description
      t(descOp, 1, 450, 250),
      t(descY,  0, 450, 250),
      // Primary Button
      t(btnOp,    1, 450, 350),
      t(btnY,     0, 450, 350),
      t(btnScale, 1, 450, 350),
      // Secondary actions
      t(secOp, 1, 350, 450),
    ]).start();
  }, []);

  // ── Press helpers ───────────────────────────────────────────────────────
  const pressIn = (val: Animated.Value, toValue = 0.98) =>
    Animated.timing(val, {
      toValue,
      duration: 120,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();

  const pressOut = (val: Animated.Value) =>
    Animated.timing(val, {
      toValue: 1,
      duration: 180,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();

  const handleOpenEmail = () => {
    const scheme = Platform.OS === 'ios' ? 'message://' : 'mailto:';
    Linking.openURL(scheme).catch(() => {});
  };

  return (
    <Animated.View style={[styles.container, { opacity: bgOpacity }]}>
      <SafeAreaView style={styles.safe}>
        {/* ── Back Button ─────────────────────────────────────────────── */}
        <Animated.View style={[styles.backButtonWrapper, { opacity: backOp }]}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            style={styles.backButton}
          >
            <Feather name="arrow-left" size={22} color="#FFFFFF" />
          </Pressable>
        </Animated.View>

        {/* ── Main scrollable content ──────────────────────────────────── */}
        <View style={[styles.body, { paddingTop: iconTopOffset }]}>
          {/* Icon */}
          <Animated.View
            style={[
              styles.iconWrapper,
              {
                opacity: iconOpacity,
                transform: [{ scale: iconScale }, { translateY: iconY }],
              },
            ]}
          >
            <View style={styles.iconBox}>
              {/* Hand-drawn style envelope rendered with Feather at large size */}
              <Feather name="mail" size={52} color="#FFFFFF" />
            </View>
          </Animated.View>

          {/* Heading */}
          <Animated.Text
            style={[
              styles.heading,
              { opacity: headingOp, transform: [{ translateY: headingY }] },
            ]}
          >
            RECOVERY LINK SENT
          </Animated.Text>

          {/* Description */}
          <Animated.Text
            style={[
              styles.description,
              { opacity: descOp, transform: [{ translateY: descY }] },
            ]}
          >
            We've sent a password reset link to your email. Check your inbox and
            follow the instructions to create a new password.
          </Animated.Text>
        </View>

        {/* ── Bottom actions ───────────────────────────────────────────── */}
        <View style={styles.bottomContainer}>
          {/* Primary Button */}
          <Animated.View
            style={{
              opacity: btnOp,
              transform: [
                { translateY: btnY },
                { scale: btnScale },
                { scale: primaryPressScale },
              ],
            }}
          >
            <Pressable
              onPress={handleOpenEmail}
              onPressIn={() => pressIn(primaryPressScale)}
              onPressOut={() => pressOut(primaryPressScale)}
              style={styles.primaryBtn}
            >
              <Text style={styles.primaryBtnLabel}>OPEN EMAIL</Text>
              <Feather
                name="chevron-right"
                size={15}
                color="#000000"
                style={styles.primaryBtnIcon}
              />
            </Pressable>
          </Animated.View>

          {/* Secondary Actions */}
          <Animated.View style={[styles.secondaryContainer, { opacity: secOp }]}>
            {/* Back to Login */}
            <Animated.View style={{ transform: [{ scale: secondaryPressScale }] }}>
              <Pressable
                onPress={() => router.replace('/(auth)/login')}
                onPressIn={() => pressIn(secondaryPressScale, 0.97)}
                onPressOut={() => pressOut(secondaryPressScale)}
                style={styles.secondaryBtn}
              >
                <Text style={styles.secondaryBtnLabel}>BACK TO LOGIN</Text>
              </Pressable>
            </Animated.View>

            {/* Resend Link */}
            <Pressable
              onPress={() => router.back()}
              style={styles.resendBtn}
            >
              <Text style={styles.resendLabel}>RESEND LINK</Text>
            </Pressable>
          </Animated.View>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  safe: {
    flex: 1,
  },

  // Back button
  backButtonWrapper: {
    position: 'absolute',
    top: 54,
    left: 20,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Main body — icon + text sit here, pushed down from top
  body: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 28,
  },

  // Icon
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 36,
  },
  iconBox: {
    width: 112,
    height: 112,
    borderRadius: 14,
    backgroundColor: '#0A0A0A',
    borderWidth: 1,
    borderColor: '#1C1C1E',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Heading
  heading: {
    fontFamily: fontFamilies.bold,
    fontSize: 22,
    letterSpacing: 1.8,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 14,
  },

  // Description
  description: {
    fontFamily: fontFamilies.regular,
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 290,
  },

  // Bottom container
  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 48,
    gap: 0,
  },

  // Primary Button
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 54,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    marginBottom: 28,
  },
  primaryBtnLabel: {
    fontFamily: fontFamilies.bold,
    fontSize: 13,
    letterSpacing: 2,
    color: '#000000',
  },
  primaryBtnIcon: {
    marginLeft: 6,
    marginTop: 1,
  },

  // Secondary Actions
  secondaryContainer: {
    alignItems: 'center',
    gap: 16,
  },
  secondaryBtn: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  secondaryBtnLabel: {
    fontFamily: fontFamilies.bold,
    fontSize: 12,
    letterSpacing: 1.8,
    color: '#FFFFFF',
  },
  resendBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  resendLabel: {
    fontFamily: fontFamilies.regular,
    fontSize: 12,
    letterSpacing: 1.4,
    color: '#52525B',
    textDecorationLine: 'underline',
  },
});
