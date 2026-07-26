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
import { Feather, MaterialCommunityIcons, Ionicons, Entypo } from '@expo/vector-icons';

import { Button } from '@/components/common/Button';
import { Screen } from '@/components/common/Screen';
import { StepIndicator } from '@/components/common/StepIndicator';
import { colors } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

const TOTAL_STEPS = 8;
const CURRENT_STEP = 4; // fifth step (0-indexed)
const MAX_SELECTIONS = 4;

type WeaknessOption = {
    id: string;
    icon: React.ReactNode;
    title: string;
    fullWidth?: boolean;
};

const WEAKNESSES: WeaknessOption[] = [
    {
        id: 'procrastination',
        icon: <Feather name="loader" size={20} color="#A1A1AA" />,
        title: 'Procrastination',
    },
    {
        id: 'no_routine',
        icon: <MaterialCommunityIcons name="sync" size={20} color="#A1A1AA" />,
        title: 'No routine',
    },
    {
        id: 'low_energy',
        icon: <MaterialCommunityIcons name="battery-10" size={20} color="#A1A1AA" />,
        title: 'Low energy',
    },
    {
        id: 'distraction',
        icon: <MaterialCommunityIcons name="weather-sunny" size={20} color="#A1A1AA" />,
        title: 'Distraction',
    },
    {
        id: 'fear_of_failure',
        icon: <Feather name="lock" size={20} color="#A1A1AA" />,
        title: 'Fear of failure',
    },
    {
        id: 'no_time',
        icon: <Feather name="clock" size={20} color="#A1A1AA" />,
        title: 'No time',
    },
    {
        id: 'inconsistency',
        icon: <MaterialCommunityIcons name="history" size={20} color="#A1A1AA" />,
        title: 'Inconsistency',
    },
    {
        id: 'loss_of_motivation',
        icon: <MaterialCommunityIcons name="trending-down" size={20} color="#A1A1AA" />,
        title: 'Loss of motivation',
    },
    {
        id: 'comparing_to_others',
        icon: <Feather name="users" size={20} color="#A1A1AA" />,
        title: 'Comparing to others',
        fullWidth: true,
    },
    {
        id: 'pressure_burnout',
        icon: <Feather name="x-circle" size={20} color="#A1A1AA" />,
        title: 'Pressure & burnout',
        fullWidth: true,
    },
];

export default function WeaknessScreen() {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

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

    const toggleSelection = (id: string) => {
        setSelectedIds((prev) => {
            if (prev.includes(id)) {
                return prev.filter((item) => item !== id);
            }
            if (prev.length >= MAX_SELECTIONS) {
                return prev;
            }
            return [...prev, id];
        });
    };

    const handleContinue = () => {
        if (selectedIds.length === 0) return;
        // Navigate to step 4: assessment
        router.push('/(onboarding)/assessment');
    };

    const renderIcon = (option: WeaknessOption, isSelected: boolean) => {
        const iconColor = isSelected ? colors.accentGold : '#A1A1AA';

        // Switch on ID to provide selected colored version
        switch (option.id) {
            case 'procrastination': return <Feather name="loader" size={20} color={iconColor} />;
            case 'no_routine': return <MaterialCommunityIcons name="sync" size={20} color={iconColor} />;
            case 'low_energy': return <MaterialCommunityIcons name="battery-10" size={20} color={iconColor} />;
            case 'distraction': return <MaterialCommunityIcons name="weather-sunny" size={20} color={iconColor} />;
            case 'fear_of_failure': return <Feather name="lock" size={20} color={iconColor} />;
            case 'no_time': return <Feather name="clock" size={20} color={iconColor} />;
            case 'inconsistency': return <MaterialCommunityIcons name="history" size={20} color={iconColor} />;
            case 'loss_of_motivation': return <MaterialCommunityIcons name="trending-down" size={20} color={iconColor} />;
            case 'comparing_to_others': return <Feather name="users" size={20} color={iconColor} />;
            case 'pressure_burnout': return <Feather name="x-circle" size={20} color={iconColor} />;
            default: return option.icon;
        }
    };

    // Group items into pairs if not fullWidth
    const renderGrid = () => {
        const gridItems = [];
        let i = 0;
        while (i < WEAKNESSES.length) {
            const item1 = WEAKNESSES[i];
            if (item1.fullWidth) {
                gridItems.push(
                    <View key={`row-${i}`} style={styles.gridRowFull}>
                        {renderOption(item1)}
                    </View>
                );
                i++;
            } else {
                const item2 = i + 1 < WEAKNESSES.length && !WEAKNESSES[i + 1].fullWidth ? WEAKNESSES[i + 1] : null;
                gridItems.push(
                    <View key={`row-${i}`} style={styles.gridRowPair}>
                        <View style={styles.gridCell}>{renderOption(item1)}</View>
                        <View style={styles.gridCell}>{item2 ? renderOption(item2) : null}</View>
                    </View>
                );
                i += item2 ? 2 : 1;
            }
        }
        return gridItems;
    };

    const renderOption = (option: WeaknessOption) => {
        const isSelected = selectedIds.includes(option.id);
        const isDisabled = !isSelected && selectedIds.length >= MAX_SELECTIONS;

        return (
            <Pressable
                onPress={() => toggleSelection(option.id)}
                disabled={isDisabled}
                style={[
                    styles.optionBox,
                    isSelected && styles.optionBoxSelected,
                    isDisabled && styles.optionBoxDisabled,
                ]}
            >
                <View style={styles.optionIconWrapper}>
                    {renderIcon(option, isSelected)}
                </View>
                <Text style={[styles.optionTitle, isSelected && styles.optionTitleSelected]}>
                    {option.title}
                </Text>
            </Pressable>
        );
    };

    return (
        <Screen style={styles.screen}>
            <View style={styles.topBar}>
                <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backButton}>
                    <Feather name="arrow-left" size={22} color="#FFFFFF" />
                </Pressable>
                <View style={styles.indicatorWrapper}>
                    <StepIndicator totalSteps={TOTAL_STEPS} currentStep={CURRENT_STEP} />
                </View>
                <View style={styles.backButton} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <Animated.View style={fadeSlideStyle(headerAnim)}>
                    <Text style={styles.sectionLabel}>IDENTIFY WEAKNESS</Text>
                    <Text style={styles.title}>What stands{'\n'}between you?</Text>
                    <Text style={styles.description}>
                        Every hunter has a weakness the system must account for. Select all that apply.
                    </Text>
                    <Text style={styles.selectRequirement}>
                        SELECT <Text style={styles.selectRequirementHighlight}>1</Text> OF UP TO 4
                    </Text>
                </Animated.View>

                <Animated.View style={[styles.optionsGrid, fadeSlideStyle(listAnim)]}>
                    {renderGrid()}
                </Animated.View>
            </ScrollView>

            <Animated.View style={[styles.bottomSection, fadeSlideStyle(buttonAnim)]}>
                <View style={styles.weaknessesCounterContainer}>
                    <Text style={styles.weaknessesCounterText}>
                        WEAKNESSES IDENTIFIED: <Text style={styles.weaknessesCounterHighlight}>{selectedIds.length}</Text>
                    </Text>

                    <View style={styles.progressBarContainer}>
                        {Array.from({ length: 4 }).map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.progressDash,
                                    index < selectedIds.length && styles.progressDashActive
                                ]}
                            />
                        ))}
                    </View>
                </View>

                <View style={styles.bottomBar}>
                    <Button
                        label="CONTINUE"
                        onPress={handleContinue}
                        variant="primary"
                        disabled={selectedIds.length === 0}
                        style={styles.ctaButton}
                        labelStyle={styles.ctaLabel}
                    />
                </View>
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
        marginBottom: 20,
    },
    selectRequirement: {
        fontFamily: fontFamilies.bold,
        fontSize: 11,
        letterSpacing: 2,
        color: '#52525B',
        marginBottom: 24,
        textTransform: 'uppercase',
    },
    selectRequirementHighlight: {
        color: colors.accentGold,
    },

    /* ─── Grid Options ─── */
    optionsGrid: {
        gap: 12,
    },
    gridRowPair: {
        flexDirection: 'row',
        gap: 12,
    },
    gridRowFull: {
        width: '100%',
    },
    gridCell: {
        flex: 1,
    },
    optionBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#141416',
        borderWidth: 1,
        borderColor: '#26262B',
        borderRadius: 12,
        paddingVertical: 18,
        paddingHorizontal: 16,
        minHeight: 64,
    },
    optionBoxSelected: {
        borderColor: colors.accentGold,
        backgroundColor: 'rgba(229, 169, 60, 0.08)',
    },
    optionBoxDisabled: {
        opacity: 0.5,
    },
    optionIconWrapper: {
        marginRight: 12,
        width: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionTitle: {
        flex: 1,
        fontFamily: fontFamilies.semiBold,
        fontSize: 14,
        color: '#FFFFFF',
    },
    optionTitleSelected: {
        color: colors.accentGold,
    },

    /* ─── Bottom Section ─── */
    bottomSection: {
        paddingBottom: Platform.OS === 'ios' ? 8 : 20,
    },
    weaknessesCounterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        marginBottom: 16,
    },
    weaknessesCounterText: {
        fontFamily: fontFamilies.bold,
        fontSize: 11,
        color: '#71717A',
        letterSpacing: 1,
    },
    weaknessesCounterHighlight: {
        color: colors.accentGold,
    },
    progressBarContainer: {
        flexDirection: 'row',
        gap: 4,
    },
    progressDash: {
        width: 16,
        height: 3,
        backgroundColor: '#26262B',
        borderRadius: 2,
    },
    progressDashActive: {
        backgroundColor: colors.accentGold,
    },

    bottomBar: {
        paddingHorizontal: 24,
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
