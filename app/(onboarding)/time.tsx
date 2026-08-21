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
import { Feather } from '@expo/vector-icons';

import { Button } from '@/components/common/Button';
import { Screen } from '@/components/common/Screen';
import { StepIndicator } from '@/components/common/StepIndicator';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';
import { useOnboardingStore } from '@/store/useOnboardingStore';

const TOTAL_STEPS = 8;
const CURRENT_STEP = 6; // seventh step (0-indexed)

type TimeOption = {
    id: string;
    value: string;
    unit: string;
    description: string;
    // Canonical value the backend's protein-goal multiplier lookup expects —
    // must be exactly "15min" | "30min" | "1hr" | "2hr_plus". Display-only
    // label shown to the user (below) is derived separately and unaffected.
    answer: string;
};

const TIME_OPTIONS: TimeOption[] = [
    {
        id: '15_min',
        value: '15',
        unit: 'MIN / DAY',
        description: 'Minimal commitment. Still lethal.',
        answer: '15min',
    },
    {
        id: '30_min',
        value: '30',
        unit: 'MIN / DAY',
        description: 'Steady progress. Builds fast.',
        answer: '30min',
    },
    {
        id: '1_hr',
        value: '1',
        unit: 'HR / DAY',
        description: 'Serious hunter. Strong returns.',
        answer: '1hr',
    },
    {
        id: '2_plus_hr',
        value: '2+',
        unit: 'HR / DAY',
        description: 'Raid mode. Maximum evolution.',
        answer: '2hr_plus',
    },
];

export default function TimeScreen() {
    const storeDailyTimeId = useOnboardingStore((s) => s.dailyTimeId);
    const [selectedId, setSelectedId] = useState<string | null>(storeDailyTimeId);
    const setDailyTimeId = useOnboardingStore((s) => s.setDailyTimeId);
    const setDailyTimeLabel = useOnboardingStore((s) => s.setDailyTimeLabel);
    const setDailyTimeAnswer = useOnboardingStore((s) => s.setDailyTimeAnswer);

    // Animations
    const headerAnim = useRef(new Animated.Value(0)).current;
    const listAnim = useRef(new Animated.Value(0)).current;
    const buttonAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.stagger(150, [
            Animated.timing(headerAnim, {
                toValue: 1,
                duration: 700,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.timing(listAnim, {
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
    }, [headerAnim, listAnim, buttonAnim]);

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
        if (!selectedId) return;
        setDailyTimeId(selectedId);
        // Save the selected time commitment to store for the oath summary
        const selected = TIME_OPTIONS.find((t) => t.id === selectedId);
        if (selected) {
            const label = `${selected.value}${selected.unit.includes('HR') ? 'h' : 'm'}`;
            setDailyTimeLabel(label);
            setDailyTimeAnswer(selected.answer);
        }
        // Navigate to the oath screen (final onboarding step)
        router.push('/(onboarding)/oath');
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
                <Animated.View style={fadeSlideStyle(headerAnim)}>
                    <Text style={styles.sectionLabel}>TRAINING WINDOW</Text>
                    <Text style={styles.title}>How much time can{'\n'}you commit daily?</Text>
                    <Text style={styles.description}>
                        The system calibrates your quest difficulty to your real availability. Be honest — this determines your load.
                    </Text>
                </Animated.View>

                <Animated.View style={[styles.gridContainer, fadeSlideStyle(listAnim)]}>
                    {TIME_OPTIONS.map((option) => {
                        const isSelected = selectedId === option.id;
                        return (
                            <Pressable
                                key={option.id}
                                onPress={() => setSelectedId(option.id)}
                                style={[
                                    styles.optionCard,
                                    isSelected && styles.optionCardSelected,
                                ]}
                            >
                                {/* Dot top right corner */}
                                <View style={[styles.indicatorDot, isSelected && styles.indicatorDotSelected]} />

                                <View style={styles.optionContent}>
                                    <Text style={[styles.optionValue, isSelected && styles.optionValueSelected]}>{option.value}</Text>
                                    <Text style={[styles.optionUnit, isSelected && styles.optionUnitSelected]}>{option.unit}</Text>
                                    <Text style={styles.optionDesc}>{option.description}</Text>
                                </View>
                            </Pressable>
                        );
                    })}
                </Animated.View>
            </ScrollView>

            {/* ─── Bottom CTA ─── */}
            <Animated.View style={[styles.bottomBar, fadeSlideStyle(buttonAnim)]}>
                <Button
                    label="SET MY SCHEDULE"
                    onPress={handleContinue}
                    variant="primary"
                    disabled={!selectedId}
                    style={styles.ctaButton}
                    labelStyle={styles.ctaLabel}
                />
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
        paddingTop: 16,
        paddingBottom: 24,
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
        fontSize: 28,
        lineHeight: 36,
        color: '#FFFFFF',
        marginBottom: 16,
    },
    description: {
        fontFamily: fontFamilies.regular,
        fontSize: 14,
        lineHeight: 21,
        color: '#8E8E93',
        marginBottom: 32,
    },

    /* ─── Grid Options ─── */
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    optionCard: {
        width: '47.5%', // Slightly less than 50% to account for gap
        backgroundColor: '#141416',
        borderWidth: 1,
        borderColor: '#26262B',
        borderRadius: 8,
        padding: 16,
        minHeight: 140,
        position: 'relative',
    },
    optionCardSelected: {
        borderColor: colors.accentGold,
        backgroundColor: 'rgba(229, 169, 60, 0.08)',
    },
    indicatorDot: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#3F3F46',
    },
    indicatorDotSelected: {
        backgroundColor: colors.accentGold,
    },
    optionContent: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    optionValue: {
        fontFamily: fontFamilies.bold,
        fontSize: 24,
        color: '#FFFFFF',
        marginBottom: 4,
    },
    optionValueSelected: {
        color: '#FFFFFF',
    },
    optionUnit: {
        fontFamily: fontFamilies.semiBold,
        fontSize: 10,
        color: colors.accentGold,
        marginBottom: 12,
    },
    optionUnitSelected: {
        color: colors.accentGold,
    },
    optionDesc: {
        fontFamily: fontFamilies.regular,
        fontSize: 11,
        color: '#A1A1AA',
        lineHeight: 16,
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
