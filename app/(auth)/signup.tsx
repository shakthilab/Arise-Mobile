import { useEffect, useRef, useState } from 'react';
import { Link, router } from 'expo-router';
import { Animated, Easing, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { Button } from '@/components/common/Button';
import { Screen } from '@/components/common/Screen';
import { useAuth } from '@/hooks/useAuth';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

export default function SignupScreen() {
  const { signup, isAuthenticating } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [focusedInput, setFocusedInput] = useState<'name' | 'email' | 'password' | null>(null);

  const titleAnim = useRef(new Animated.Value(0)).current;
  const formAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(140, [
      Animated.timing(titleAnim, {
        toValue: 1,
        duration: 850,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(formAnim, {
        toValue: 1,
        duration: 850,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
    ]).start();
  }, [titleAnim, formAnim]);

  const createAnimatedStyle = (animVal: Animated.Value) => ({
    opacity: animVal,
    transform: [
      {
        translateY: animVal.interpolate({
          inputRange: [0, 1],
          outputRange: [60, 0],
        }),
      },
    ],
  });

  const handleSignup = async () => {
    setError(null);
    try {
      await signup(email, password, displayName);
      router.replace('/(onboarding)/name');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    }
  };

  return (
    <Screen style={styles.container}>
      <Animated.View style={createAnimatedStyle(titleAnim)}>
        <Text style={styles.title}>CREATE YOUR HUNTER</Text>
        <Text style={styles.subtitle}>Enter your details to join the System</Text>
      </Animated.View>

      <Animated.View style={[styles.form, createAnimatedStyle(formAnim)]}>
        <View
          style={[
            styles.inputWrapper,
            focusedInput === 'name' && styles.inputWrapperFocused,
          ]}
        >
          <Feather
            name="user"
            size={18}
            color={focusedInput === 'name' ? colors.accentGold : '#71717A'}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Display Name"
            placeholderTextColor="#52525B"
            value={displayName}
            onChangeText={setDisplayName}
            onFocus={() => setFocusedInput('name')}
            onBlur={() => setFocusedInput(null)}
          />
        </View>

        <View
          style={[
            styles.inputWrapper,
            focusedInput === 'email' && styles.inputWrapperFocused,
          ]}
        >
          <Feather
            name="mail"
            size={18}
            color={focusedInput === 'email' ? colors.accentGold : '#71717A'}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Hunters ID (Email)"
            placeholderTextColor="#52525B"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            onFocus={() => setFocusedInput('email')}
            onBlur={() => setFocusedInput(null)}
          />
        </View>

        <View
          style={[
            styles.inputWrapper,
            focusedInput === 'password' && styles.inputWrapperFocused,
          ]}
        >
          <Feather
            name="lock"
            size={18}
            color={focusedInput === 'password' ? colors.accentGold : '#71717A'}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Secret Key (Password)"
            placeholderTextColor="#52525B"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            onFocus={() => setFocusedInput('password')}
            onBlur={() => setFocusedInput(null)}
          />
          <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={10}>
            <Feather
              name={showPassword ? 'eye' : 'eye-off'}
              size={18}
              color={focusedInput === 'password' ? colors.accentGold : '#71717A'}
            />
          </Pressable>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Button
          label="CREATE ACCOUNT"
          onPress={handleSignup}
          loading={isAuthenticating}
          variant="primary"
          style={styles.signupButton}
          labelStyle={styles.signupButtonLabel}
        />

        <View style={styles.loginLinkContainer}>
          <Text style={styles.loginPrefix}>Already a Hunter? </Text>
          <Link href="/(auth)/login" asChild>
            <Pressable>
              <Text style={styles.loginLink}>Log in</Text>
            </Pressable>
          </Link>
        </View>
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#000000',
  },
  title: {
    fontFamily: fontFamilies.bold,
    fontSize: 24,
    letterSpacing: 4,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: 13,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  form: {
    gap: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0C0C0E',
    borderWidth: 1,
    borderColor: '#26262B',
    borderRadius: 8,
    height: 52,
    paddingHorizontal: 16,
  },
  inputWrapperFocused: {
    borderColor: colors.accentGold,
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
  errorText: {
    fontFamily: fontFamilies.regular,
    fontSize: 13,
    color: colors.danger,
    textAlign: 'center',
  },
  signupButton: {
    height: 52,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    marginTop: 8,
  },
  signupButtonLabel: {
    fontFamily: fontFamilies.bold,
    fontSize: 13,
    letterSpacing: 2,
    color: '#000000',
  },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loginPrefix: {
    fontFamily: fontFamilies.regular,
    fontSize: 13,
    color: '#71717A',
  },
  loginLink: {
    fontFamily: fontFamilies.medium,
    fontSize: 13,
    color: '#FFFFFF',
    textDecorationLine: 'underline',
  },
});
