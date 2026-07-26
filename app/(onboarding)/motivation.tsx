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
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

import { Button } from '@/components/common/Button';
import { Screen } from '@/components/common/Screen';
import { StepIndicator } from '@/components/common/StepIndicator';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';
import { useOnboardingStore } from '@/store/useOnboardingStore';

const TOTAL_STEPS = 8;
const CURRENT_STEP = 3; // fourth step (0-indexed)

type MotivationOption = {
    id: string;
    icon: React.ReactNode;
    title: string;
    subtitle: string;
};

const MOTIVATIONS: MotivationOption[] = [
    {
        id: 'discipline',
        icon: <MaterialCommunityIcons name="sword-cross" size={20} color="#A1A1AA" />,
        title: 'Forge unbreakable discipline',
        subtitle: 'Build habits that survive failure.',
    },
    {
        id: 'physical',
        icon: <MaterialCommunityIcons name="arm-flex" size={20} color="#A1A1AA" />,
        title: 'Reach peak physical form',
        subtitle: "Train the body like it's a dungeon.",
    },
    {
        id: 'focus',
        icon: <Ionicons name="settings-sharp" size={18} color="#A1A1AA" />,
        title: 'Sharpen mental focus',
        subtitle: 'Eliminate noise. Execute with clarity.',
    },
    {
        id: 'legacy',
        icon: <MaterialCommunityIcons name="crown" size={20} color="#A1A1AA" />,
        title: 'Build a lasting legacy',
        subtitle: 'Become someone worth remembering.',
    },
    {
        id: 'prove',
        icon: <Feather name="circle" size={18} color="#A1A1AA" />,
        title: 'Prove them wrong',
        subtitle: 'Use doubt as fuel. Rise in silence.',
    },
];

export default function MotivationScreen() {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const setMotivationId = useOnboardingStore((s) => s.setMotivationId);

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
        // Save the selected motivation ID to store for the oath summary icon
        setMotivationId(selectedId);
        // Navigate to step 3: weakness
        router.push('/(onboarding)/weakness');
    };

    const renderIcon = (option: MotivationOption, isSelected: boolean) => {
        if (isSelected) {
            // Re-render icon with gold color when selected
            const iconMap: Record<string, React.ReactNode> = {
                discipline: <MaterialCommunityIcons name="sword-cross" size={20} color={colors.accentGold} />,
                physical: <MaterialCommunityIcons name="arm-flex" size={20} color={colors.accentGold} />,
                focus: <Ionicons name="settings-sharp" size={18} color={colors.accentGold} />,
                legacy: <MaterialCommunityIcons name="crown" size={20} color={colors.accentGold} />,
                prove: <Feather name="circle" size={18} color={colors.accentGold} />,
            };
            return iconMap[option.id] ?? option.icon;
        }
        return option.icon;
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
                {/* Spacer */}
                <View style={styles.backButton} />
            </View>

            {/* ─── Scrollable Content ─── */}
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <Animated.View style={fadeSlideStyle(headerAnim)}>
                    <Text style={styles.sectionLabel}>CORE DRIVE</Text>
                    <Text style={styles.title}>Why do you want to{'\n'}level up?</Text>
                    <Text style={styles.description}>
                        The system needs to understand your primary motivation. Choose the one that resonates
                        deepest.
                    </Text>
                </Animated.View>

                {/* Options List */}
                <Animated.View style={[styles.optionsList, fadeSlideStyle(listAnim)]}>
                    {MOTIVATIONS.map((option, index) => {
                        const isSelected = selectedId === option.id;
                        return (
                            <View key={option.id}>
                                <Pressable
                                    onPress={() => setSelectedId(option.id)}
                                    style={[
                                        styles.optionRow,
                                        isSelected && styles.optionRowSelected,
                                    ]}
                                >
                                    {/* Icon */}
                                    <View style={[styles.optionIcon, isSelected && styles.optionIconSelected]}>
                                        {renderIcon(option, isSelected)}
                                    </View>

                                    {/* Text */}
                                    <View style={styles.optionTextContainer}>
                                        <Text style={[styles.optionTitle, isSelected && styles.optionTitleSelected]}>
                                            {option.title}
                                        </Text>
                                        <Text style={[styles.optionSubtitle, isSelected && styles.optionSubtitleSelected]}>
                                            {option.subtitle}
                                        </Text>
                                    </View>

                                    {/* Radio indicator */}
                                    <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                                        {isSelected && <View style={styles.radioInner} />}
                                    </View>
                                </Pressable>

                                {/* Separator (not after last item) */}
                                {index < MOTIVATIONS.length - 1 && !isSelected && (
                                    selectedId !== MOTIVATIONS[index + 1]?.id ? (
                                        <View style={styles.separator} />
                                    ) : null
                                )}
                            </View>
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
        fontSize: 28,
        lineHeight: 36,
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
        gap: 0,
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 18,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    optionRowSelected: {
        borderColor: colors.accentGold,
        backgroundColor: 'rgba(229, 169, 60, 0.06)',
    },
    optionIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    optionIconSelected: {
        // Keep same layout, icon color changes
    },
    optionTextContainer: {
        flex: 1,
    },
    optionTitle: {
        fontFamily: fontFamilies.semiBold,
        fontSize: 15,
        color: '#FFFFFF',
        marginBottom: 3,
    },
    optionTitleSelected: {
        color: '#FFFFFF',
    },
    optionSubtitle: {
        fontFamily: fontFamilies.regular,
        fontSize: 13,
        color: '#71717A',
    },
    optionSubtitleSelected: {
        color: '#8E8E93',
    },

    /* ─── Radio ─── */
    radioOuter: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: '#3F3F46',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 12,
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

    /* ─── Separator ─── */
    separator: {
        height: 1,
        backgroundColor: '#1A1A1E',
        marginLeft: 66,
        marginRight: 8,
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
