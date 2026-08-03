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
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

import { Button } from '@/components/common/Button';
import { Screen } from '@/components/common/Screen';
import { StepIndicator } from '@/components/common/StepIndicator';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';
import { useOnboardingStore } from '@/store/useOnboardingStore';

const TOTAL_STEPS = 8;
const CURRENT_STEP = 5; // sixth step (0-indexed)

type RankOption = {
    id: string;
    rankIndex: number;
    icon: (color: string) => React.ReactNode;
    titlePrefix: string;
    titleSuffix: string;
    subtitle: string;
    bars: number;
};

const RANKS: RankOption[] = [
    {
        id: 'beginner',
        rankIndex: 0,
        icon: (color) => <MaterialCommunityIcons name="shield-outline" size={20} color={color} />,
        titlePrefix: 'Beginner',
        titleSuffix: ' — Just starting out',
        subtitle: 'No habits. Starting from scratch.',
        bars: 1,
    },
    {
        id: 'intermediate',
        rankIndex: 1,
        icon: (color) => <MaterialCommunityIcons name="shield-half-full" size={20} color={color} />,
        titlePrefix: 'Intermediate',
        titleSuffix: ' — Some experience',
        subtitle: 'Tried forming habits. Inconsistent but improving.',
        bars: 3,
    },
    {
        id: 'advanced',
        rankIndex: 2,
        icon: (color) => <MaterialCommunityIcons name="shield-crown" size={20} color={color} />,
        titlePrefix: 'Advanced',
        titleSuffix: ' — High performer',
        subtitle: 'Solid foundations. Systems in place. Optimizing for mastery.',
        bars: 5,
    },
];

export default function AssessmentScreen() {
    const storeRank = useOnboardingStore((s) => s.rank);
    const setRankStore = useOnboardingStore((s) => s.setRank);
    const [selectedId, setSelectedId] = useState<string | null>(storeRank);

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
        setRankStore(selectedId);
        // Navigate to step 5: time
        router.push('/(onboarding)/time');
    };

    const renderRankBars = (filledCount: number, isSelected: boolean) => {
        return (
            <View style={styles.barsContainer}>
                {Array.from({ length: 5 }).map((_, i) => (
                    <View
                        key={i}
                        style={[
                            styles.rankBar,
                            i < filledCount && styles.rankBarFilled,
                            isSelected && i < filledCount && styles.rankBarFilledSelected,
                        ]}
                    />
                ))}
            </View>
        );
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
                    <Text style={styles.sectionLabel}>SELF ASSESSMENT</Text>
                    <Text style={styles.title}>Where do you{'\n'}currently stand?</Text>
                    <Text style={styles.description}>
                        Be honest. The system cannot assign your rank — only you know the truth. This calibrates your starting gate.
                    </Text>
                </Animated.View>

                <Animated.View style={[styles.optionsList, fadeSlideStyle(listAnim)]}>
                    {RANKS.map((option) => {
                        const isSelected = selectedId === option.id;
                        return (
                            <Pressable
                                key={option.id}
                                onPress={() => setSelectedId(option.id)}
                                style={[
                                    styles.optionBox,
                                    isSelected && styles.optionBoxSelected,
                                ]}
                            >
                                {/* Rank Box (Left) */}
                                <View style={[styles.rankLetterBox, isSelected && styles.rankLetterBoxSelected]}>
                                    {option.icon(isSelected ? colors.accentGold : '#A1A1AA')}
                                </View>

                                {/* Content (Middle) */}
                                <View style={styles.optionContent}>
                                    <Text style={styles.optionTitleRow}>
                                        <Text style={[styles.optionTitlePrefix, isSelected && styles.optionTitlePrefixSelected]}>
                                            {option.titlePrefix}
                                        </Text>
                                        <Text style={styles.optionTitleSuffix}>
                                            {option.titleSuffix}
                                        </Text>
                                    </Text>

                                    <Text style={[styles.optionSubtitle, isSelected && styles.optionSubtitleSelected]}>
                                        {option.subtitle}
                                    </Text>

                                    {renderRankBars(option.bars, isSelected)}
                                </View>

                                {/* Radio (Right) */}
                                <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                                    {isSelected && <View style={styles.radioInner} />}
                                </View>
                            </Pressable>
                        );
                    })}
                </Animated.View>
            </ScrollView>

            {/* ─── Bottom CTA ─── */}
            <Animated.View style={[styles.bottomBar, fadeSlideStyle(buttonAnim)]}>
                <Button
                    label="CONTINUE"
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
        marginBottom: 28,
    },

    /* ─── Options ─── */
    optionsList: {
        gap: 12,
    },
    optionBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#141416',
        borderWidth: 1,
        borderColor: '#26262B',
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 16,
    },
    optionBoxSelected: {
        borderColor: colors.accentGold,
        backgroundColor: 'rgba(229, 169, 60, 0.06)',
    },

    /* Rank Letter Box */
    rankLetterBox: {
        width: 40,
        height: 40,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#26262B',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    rankLetterBoxSelected: {
        borderColor: colors.accentGold,
    },
    rankLetterText: {
        fontFamily: fontFamilies.bold,
        fontSize: 14,
        color: '#A1A1AA',
    },
    rankLetterTextSelected: {
        color: colors.accentGold,
    },

    /* Content */
    optionContent: {
        flex: 1,
        marginRight: 12,
    },
    optionTitleRow: {
        marginBottom: 4,
    },
    optionTitlePrefix: {
        fontFamily: fontFamilies.bold,
        fontSize: 15,
        color: '#E4E4E7',
    },
    optionTitlePrefixSelected: {
        color: '#FFFFFF',
    },
    optionTitleSuffix: {
        fontFamily: fontFamilies.regular,
        fontSize: 14,
        color: '#A1A1AA',
    },
    optionSubtitle: {
        fontFamily: fontFamilies.regular,
        fontSize: 12,
        color: '#71717A',
        lineHeight: 18,
        marginBottom: 8,
    },
    optionSubtitleSelected: {
        color: '#8E8E93',
    },

    /* Rank Bars */
    barsContainer: {
        flexDirection: 'row',
        gap: 4,
    },
    rankBar: {
        width: 12,
        height: 3,
        borderRadius: 2,
        backgroundColor: '#26262B',
    },
    rankBarFilled: {
        backgroundColor: '#52525B',
    },
    rankBarFilledSelected: {
        backgroundColor: '#A1A1AA',
    },

    /* Radio */
    radioOuter: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: '#3F3F46',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioOuterSelected: {
        borderColor: colors.accentGold,
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: colors.accentGold,
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
