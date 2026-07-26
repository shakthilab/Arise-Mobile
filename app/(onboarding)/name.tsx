import { useEffect, useRef, useState } from 'react';
import { router } from 'expo-router';
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
    View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

import { Button } from '@/components/common/Button';
import { Screen } from '@/components/common/Screen';
import { StepIndicator } from '@/components/common/StepIndicator';
import { useAuth } from '@/hooks/useAuth';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

const TOTAL_STEPS = 8;
const CURRENT_STEP = 0; // first step (0-indexed)

export default function OnboardingNameScreen() {
    const { completeOnboarding } = useAuth();
    const [hunterName, setHunterName] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    // Animations
    const headerAnim = useRef(new Animated.Value(0)).current;
    const contentAnim = useRef(new Animated.Value(0)).current;
    const buttonAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.stagger(150, [
            Animated.timing(headerAnim, {
                toValue: 1,
                duration: 700,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.timing(contentAnim, {
                toValue: 1,
                duration: 700,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.timing(buttonAnim, {
                toValue: 1,
                duration: 700,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
        ]).start();
    }, [headerAnim, contentAnim, buttonAnim]);

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

    const handleContinue = () => {
        if (!hunterName.trim()) return;
        // Navigate to step 2: biometrics baseline
        router.push('/(onboarding)/biometrics');
    };

    return (
        <Screen style={styles.screen}>
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                {/* ─── Top Bar: Back + Step Indicator ─── */}
                <View style={styles.topBar}>
                    <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backButton}>
                        <Feather name="arrow-left" size={22} color="#FFFFFF" />
                    </Pressable>
                    <View style={styles.indicatorWrapper}>
                        <StepIndicator totalSteps={TOTAL_STEPS} currentStep={CURRENT_STEP} />
                    </View>
                    {/* Spacer for centering the indicator */}
                    <View style={styles.backButton} />
                </View>

                {/* ─── Scrollable Content ─── */}
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Section label + Title */}
                    <Animated.View style={fadeSlideStyle(headerAnim)}>
                        <Text style={styles.sectionLabel}>HUNTER IDENTITY</Text>
                        <Text style={styles.title}>What do they{'\n'}call you?</Text>
                        <Text style={styles.description}>
                            Every hunter is known by a name. Choose yours carefully — it will follow you through
                            every trial.
                        </Text>
                    </Animated.View>

                    {/* Input */}
                    <Animated.View style={[styles.inputSection, fadeSlideStyle(contentAnim)]}>
                        <View
                            style={[
                                styles.inputWrapper,
                                isFocused && styles.inputWrapperFocused,
                            ]}
                        >
                            <Feather
                                name="user"
                                size={18}
                                color={isFocused ? colors.accentGold : '#52525B'}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your hunter name"
                                placeholderTextColor="#52525B"
                                value={hunterName}
                                onChangeText={setHunterName}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                maxLength={24}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                            {hunterName.length > 0 && (
                                <Text style={styles.charCount}>
                                    {hunterName.length}/24
                                </Text>
                            )}
                        </View>

                        {/* Info Tip */}
                        <View style={styles.tipContainer}>
                            <Text style={styles.tipIcon}>◆</Text>
                            <Text style={styles.tipText}>
                                Your name is your <Text style={styles.tipBold}>sign!</Text> It cannot be changed once
                                the gate opens.
                            </Text>
                        </View>
                    </Animated.View>
                </ScrollView>

                {/* ─── Bottom CTA ─── */}
                <Animated.View style={[styles.bottomBar, fadeSlideStyle(buttonAnim)]}>
                    <Button
                        label="CLAIM YOUR NAME"
                        onPress={handleContinue}
                        variant="primary"
                        disabled={!hunterName.trim()}
                        style={styles.ctaButton}
                        labelStyle={styles.ctaLabel}
                    />
                </Animated.View>
            </KeyboardAvoidingView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    screen: {
        backgroundColor: '#0A0A0A',
    },
    flex: {
        flex: 1,
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
        paddingTop: 16,
    },
    sectionLabel: {
        fontFamily: fontFamilies.semiBold,
        fontSize: 11,
        letterSpacing: 3,
        color: colors.accentGold,
        marginBottom: 12,
        textTransform: 'uppercase',
    },
    title: {
        fontFamily: fontFamilies.bold,
        fontSize: 30,
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

    /* ─── Input ─── */
    inputSection: {
        gap: 16,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#141416',
        borderWidth: 1,
        borderColor: '#26262B',
        borderRadius: 12,
        height: 56,
        paddingHorizontal: 16,
    },
    inputWrapperFocused: {
        borderColor: colors.accentGold,
        backgroundColor: '#1A1A1E',
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        color: '#FFFFFF',
        fontFamily: fontFamilies.regular,
        fontSize: 15,
        backgroundColor: 'transparent',
        ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : {}),
    },
    charCount: {
        fontFamily: fontFamilies.regular,
        fontSize: 12,
        color: '#52525B',
    },

    /* ─── Info Tip ─── */
    tipContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: 'rgba(229, 169, 60, 0.08)',
        borderRadius: 10,
        paddingVertical: 14,
        paddingHorizontal: 16,
        gap: 10,
    },
    tipIcon: {
        fontSize: 12,
        color: colors.accentGold,
        marginTop: 2,
    },
    tipText: {
        flex: 1,
        fontFamily: fontFamilies.regular,
        fontSize: 13,
        lineHeight: 19,
        color: '#A1A1AA',
    },
    tipBold: {
        fontFamily: fontFamilies.semiBold,
        color: colors.accentGold,
    },

    /* ─── Bottom CTA ─── */
    bottomBar: {
        paddingHorizontal: 24,
        paddingBottom: Platform.OS === 'ios' ? 8 : 20,
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
