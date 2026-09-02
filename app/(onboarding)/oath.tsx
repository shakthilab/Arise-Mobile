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
import { useAuth } from '@/hooks/useAuth';
import { buildOnboardingAnswers, useOnboardingStore } from '@/store/useOnboardingStore';
import { showGlobalToast } from '@/store/useToastStore';

const TOTAL_STEPS = 8;
const CURRENT_STEP = 7; // eighth step (0-indexed)

export default function OathScreen() {
    const { isAuthenticated, submitOnboarding } = useAuth();
    const motivationIds = useOnboardingStore((s) => s.motivationIds) || [];
    const rank = useOnboardingStore((s) => s.rank);
    const dailyTimeLabel = useOnboardingStore((s) => s.dailyTimeLabel);

    const [checked1, setChecked1] = useState(false);
    const [checked2, setChecked2] = useState(false);
    const [checked3, setChecked3] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const allChecked = checked1 && checked2 && checked3;

    // Animations
    const contentAnim = useRef(new Animated.Value(0)).current;
    const buttonAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.stagger(200, [
            Animated.timing(contentAnim, {
                toValue: 1,
                duration: 800,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.timing(buttonAnim, {
                toValue: 1,
                duration: 800,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
        ]).start();
    }, [contentAnim, buttonAnim]);

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

    const handleSwearOath = async () => {
        if (!allChecked) return;

        // Already have an account — brand new Google sign-in from the Login
        // screen, sent through this wizard after the fact. Attach the answers
        // to that account instead of going through signup again.
        if (isAuthenticated) {
            setSubmitError(null);
            setIsSubmitting(true);
            try {
                await submitOnboarding(buildOnboardingAnswers());
                router.replace('/(onboarding)/ascension');
            } catch (err: any) {
                const errMsg = err instanceof Error ? err.message : 'Could not save your answers';
                if (errMsg.toLowerCase().includes('already exist') || errMsg.toLowerCase().includes('already registered')) {
                    router.replace('/(tabs)');
                    setTimeout(() => {
                        showGlobalToast('User Account is already exist', 'info');
                    }, 350);
                } else {
                    setSubmitError(errMsg);
                }
            } finally {
                setIsSubmitting(false);
            }
            return;
        }

        // Normal path — navigate to signup screen after swearing the oath
        router.push('/(auth)/signup');
    };

    return (
        <Screen style={styles.screen}>
            {/* ─── Top Bar: Back + Step Indicator ─── */}
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
                <Animated.View style={[styles.mainContent, fadeSlideStyle(contentAnim)]}>

                    {/* Icon Header */}
                    <View style={styles.iconCircle}>
                        <MaterialCommunityIcons name="shield-half-full" size={20} color={colors.accentGold} />
                    </View>

                    <Text style={styles.sectionLabel}>THE OATH</Text>
                    <Text style={styles.title}>Seal your{'\n'}commitment</Text>

                    {/* Quote Box */}
                    <View style={styles.quoteBox}>
                        <Text style={styles.quoteText}>
                            "I will not quit when it is hard.{'\n\n'}
                            I will not rest when it is easy.{'\n\n'}
                            I will <Text style={styles.quoteGold}>arise</Text> — every single day —{'\n'}
                            until <Text style={styles.quoteBold}>the hunter becomes the{'\n'}legend.</Text>"
                        </Text>
                    </View>

                    {/* Checkboxes */}
                    <View style={styles.checkboxesContainer}>
                        <Pressable style={styles.checkboxRow} onPress={() => setChecked1(!checked1)}>
                            <View style={[styles.checkbox, checked1 && styles.checkboxActive]}>
                                {checked1 && <Feather name="check" size={14} color="#000" />}
                            </View>
                            <Text style={styles.checkboxText}>
                                I understand that missing a day costs me progress and the system will not forget.
                            </Text>
                        </Pressable>

                        <Pressable style={styles.checkboxRow} onPress={() => setChecked2(!checked2)}>
                            <View style={[styles.checkbox, checked2 && styles.checkboxActive]}>
                                {checked2 && <Feather name="check" size={14} color="#000" />}
                            </View>
                            <Text style={styles.checkboxText}>
                                I accept that the system's judgement is absolute. No excuses. Only results.
                            </Text>
                        </Pressable>

                        <Pressable style={styles.checkboxRow} onPress={() => setChecked3(!checked3)}>
                            <View style={[styles.checkbox, checked3 && styles.checkboxActive]}>
                                {checked3 && <Feather name="check" size={14} color="#000" />}
                            </View>
                            <Text style={styles.checkboxText}>
                                I commit to showing up even when I don't feel ready.
                            </Text>
                        </Pressable>
                    </View>

                    {/* Summary Boxes */}
                    <View style={styles.summaryContainer}>
                        <View style={styles.summaryBox}>
                            <Text style={styles.summaryLabel}>HUNTER</Text>
                            <View style={{ flexDirection: 'row', gap: 6, marginTop: 2, alignItems: 'center' }}>
                                {motivationIds.includes('discipline') && (
                                    <MaterialCommunityIcons name="sword-cross" size={18} color="#FFFFFF" />
                                )}
                                {motivationIds.includes('physical') && (
                                    <MaterialCommunityIcons name="arm-flex" size={18} color="#FFFFFF" />
                                )}
                                {motivationIds.includes('focus') && (
                                    <Ionicons name="settings-sharp" size={18} color="#FFFFFF" />
                                )}
                                {motivationIds.includes('legacy') && (
                                    <MaterialCommunityIcons name="crown" size={18} color="#FFFFFF" />
                                )}
                                {motivationIds.includes('prove') && (
                                    <Feather name="circle" size={18} color="#FFFFFF" />
                                )}
                                {motivationIds.length === 0 && (
                                    <MaterialCommunityIcons name="crown" size={16} color="#FFFFFF" />
                                )}
                            </View>
                        </View>
                        <View style={styles.summaryBox}>
                            <Text style={styles.summaryLabel}>RANK</Text>
                            {rank === 'beginner' && <MaterialCommunityIcons name="shield-outline" size={18} color="#FFFFFF" style={{ marginTop: 2 }} />}
                            {rank === 'intermediate' && <MaterialCommunityIcons name="shield-half-full" size={18} color="#FFFFFF" style={{ marginTop: 2 }} />}
                            {rank === 'advanced' && <MaterialCommunityIcons name="shield-crown" size={18} color="#FFFFFF" style={{ marginTop: 2 }} />}
                            {!rank && <MaterialCommunityIcons name="shield-outline" size={18} color="#FFFFFF" style={{ marginTop: 2 }} />}
                        </View>
                        <View style={styles.summaryBox}>
                            <Text style={styles.summaryLabel}>DAILY</Text>
                            {dailyTimeLabel ? (
                                <Text style={styles.summaryValueWhite}>
                                    {dailyTimeLabel.replace(/[hm]/g, '')}<Text style={styles.summaryValueGold}>{dailyTimeLabel.slice(-1)}</Text>
                                </Text>
                            ) : (
                                <Text style={styles.summaryValueWhite}>
                                    30<Text style={styles.summaryValueGold}>m</Text>
                                </Text>
                            )}
                        </View>
                    </View>

                </Animated.View>
            </ScrollView>

            {/* ─── Bottom CTA ─── */}
            <Animated.View style={[styles.bottomBar, fadeSlideStyle(buttonAnim)]}>
                {submitError && <Text style={styles.errorText}>{submitError}</Text>}
                <Button
                    label="I SWEAR THE OATH"
                    onPress={handleSwearOath}
                    variant="primary"
                    disabled={!allChecked}
                    loading={isSubmitting}
                    style={styles.ctaButton}
                    labelStyle={styles.ctaLabel}
                />
                <Text style={styles.footerText}>
                    By continuing you agree to HunterX's Terms & Privacy Policy
                </Text>
            </Animated.View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    screen: {
        backgroundColor: '#0A0A0A',
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
        paddingTop: 8,
        paddingBottom: 24,
    },
    mainContent: {
        alignItems: 'center',
    },

    /* Icon */
    iconCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        borderWidth: 1,
        borderColor: '#26262B',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },

    /* Headers */
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
        fontSize: 32,
        lineHeight: 38,
        color: '#FFFFFF',
        marginBottom: 24,
        textAlign: 'center',
    },

    /* Quote Box */
    quoteBox: {
        backgroundColor: '#141416',
        borderRadius: 12,
        paddingVertical: 24,
        paddingHorizontal: 20,
        width: '100%',
        marginBottom: 32,
    },
    quoteText: {
        fontFamily: fontFamilies.medium,
        fontSize: 14,
        lineHeight: 22,
        color: '#A1A1AA',
        textAlign: 'center',
    },
    quoteGold: {
        color: colors.accentGold,
    },
    quoteBold: {
        fontFamily: fontFamilies.bold,
        color: '#FFFFFF',
    },

    /* Checkboxes */
    checkboxesContainer: {
        width: '100%',
        gap: 20,
        marginBottom: 32,
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 4,
        backgroundColor: '#1A1A1E',
        borderWidth: 1,
        borderColor: '#3F3F46',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
        marginRight: 14,
    },
    checkboxActive: {
        backgroundColor: '#FFFFFF',
        borderColor: '#FFFFFF',
    },
    checkboxText: {
        flex: 1,
        fontFamily: fontFamilies.regular,
        fontSize: 13,
        lineHeight: 20,
        color: '#FFFFFF',
    },

    /* Summary Boxes */
    summaryContainer: {
        flexDirection: 'row',
        width: '100%',
        gap: 12,
    },
    summaryBox: {
        flex: 1,
        backgroundColor: '#141416',
        borderWidth: 1,
        borderColor: '#26262B',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
    },
    summaryLabel: {
        fontFamily: fontFamilies.semiBold,
        fontSize: 10,
        letterSpacing: 1,
        color: '#71717A',
        marginBottom: 6,
    },
    summaryValue: {
        fontFamily: fontFamilies.bold,
        fontSize: 11,
        color: '#FFFFFF',
        textAlign: 'center',
        paddingHorizontal: 4,
    },
    summaryValueWhite: {
        fontFamily: fontFamilies.bold,
        fontSize: 16,
        color: '#FFFFFF',
    },
    summaryValueGold: {
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
        marginBottom: 16,
    },
    ctaLabel: {
        fontFamily: fontFamilies.bold,
        fontSize: 14,
        letterSpacing: 2,
        color: '#000000',
    },
    footerText: {
        fontFamily: fontFamilies.regular,
        fontSize: 11,
        color: '#FFFFFF',
        textAlign: 'center',
    },
    errorText: {
        fontFamily: fontFamilies.regular,
        fontSize: 13,
        color: colors.danger,
        textAlign: 'center',
        marginBottom: 12,
    },
});
