import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  GestureResponderEvent,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { MaterialCommunityIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path, Rect, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { fontFamilies } from '../../theme/typography';
import { ScratchSparkles, SparkPoint } from '../ui/ScratchSparkles';

export type ScratchRarity = 'legendary' | 'epic' | 'rare' | 'common';

export interface ScratchCardProps {
  onComplete?: () => void;
  rewardText?: string;
  rewardSubtitle?: string;
  rewardValue?: string;
  rarity?: ScratchRarity;
  iconName?: keyof typeof MaterialCommunityIcons.glyphMap;
  width?: number;
  height?: number;
  autoRevealThreshold?: number; // 0.0 to 1.0 (e.g. 0.45 = 45%)
}

interface TouchPoint {
  id: string;
  x: number;
  y: number;
}

const GRID_COLS = 6;
const GRID_ROWS = 4;
const TOTAL_GRID_CELLS = GRID_COLS * GRID_ROWS;

const RARITY_THEMES: Record<
  ScratchRarity,
  {
    borderColor: string;
    glowColor: string;
    badgeBg: string;
    textColor: string;
    gradientColors: [string, string, string];
    badgeLabel: string;
  }
> = {
  legendary: {
    borderColor: '#F59E0B',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    badgeBg: 'rgba(245, 158, 11, 0.2)',
    textColor: '#FBBF24',
    gradientColors: ['#2A1A04', '#1A1002', '#0A0601'],
    badgeLabel: 'LEGENDARY LOOT',
  },
  epic: {
    borderColor: '#C084FC',
    glowColor: 'rgba(192, 132, 252, 0.4)',
    badgeBg: 'rgba(192, 132, 252, 0.2)',
    textColor: '#E9D5FF',
    gradientColors: ['#231138', '#160A24', '#090310'],
    badgeLabel: 'EPIC DROP',
  },
  rare: {
    borderColor: '#38BDF8',
    glowColor: 'rgba(56, 189, 248, 0.4)',
    badgeBg: 'rgba(56, 189, 248, 0.2)',
    textColor: '#BAE6FD',
    gradientColors: ['#0A2540', '#061729', '#020912'],
    badgeLabel: 'RARE REWARD',
  },
  common: {
    borderColor: '#34D399',
    glowColor: 'rgba(52, 211, 153, 0.3)',
    badgeBg: 'rgba(52, 211, 153, 0.15)',
    textColor: '#A7F3D0',
    gradientColors: ['#062A1E', '#031912', '#010B08'],
    badgeLabel: 'STREAK REWARD',
  },
};

export const ScratchCard: React.FC<ScratchCardProps> = ({
  onComplete,
  rewardText = '+100 EXP',
  rewardSubtitle = 'Hunter Rank XP Booster',
  rewardValue = 'EXP +100',
  rarity = 'legendary',
  iconName = 'trophy-award',
  width = 330,
  height = 170,
  autoRevealThreshold = 0.45,
}) => {
  const [touchPoints, setTouchPoints] = useState<TouchPoint[]>([]);
  const [sparkList, setSparkList] = useState<SparkPoint[]>([]);
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchedPercent, setScratchedPercent] = useState(0);

  const revealAnim = useRef(new Animated.Value(1)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const gridCellsRef = useRef<Set<number>>(new Set());
  const isRevealedRef = useRef(false);

  const theme = RARITY_THEMES[rarity] || RARITY_THEMES.legendary;

  useEffect(() => {
    // Pulse animation on the scratch CTA pill
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoop.start();

    // Shimmer highlight effect on metallic foil
    const shimmerLoop = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 2200,
        useNativeDriver: true,
      })
    );
    shimmerLoop.start();

    return () => {
      pulseLoop.stop();
      shimmerLoop.stop();
    };
  }, []);

  const triggerSparks = (x: number, y: number) => {
    const newSparks: SparkPoint[] = Array.from({ length: 4 }).map((_, i) => ({
      id: `${Date.now()}-${i}-${Math.random()}`,
      x: x + (Math.random() - 0.5) * 24,
      y: y + (Math.random() - 0.5) * 24,
      size: Math.random() * 5 + 3,
      color: i % 2 === 0 ? theme.borderColor : '#FFFFFF',
      opacity: 0.9,
    }));

    setSparkList((prev) => [...prev.slice(-15), ...newSparks]);

    // Clean up old sparks
    setTimeout(() => {
      setSparkList((prev) => prev.filter((s) => !newSparks.includes(s)));
    }, 450);
  };

  const handleTouch = (evt: GestureResponderEvent) => {
    if (isRevealedRef.current) return;

    const { locationX, locationY } = evt.nativeEvent;
    const clampedX = Math.max(0, Math.min(width, locationX));
    const clampedY = Math.max(0, Math.min(height, locationY));

    const newPoint = {
      id: `${Date.now()}-${Math.random()}`,
      x: clampedX,
      y: clampedY,
    };

    setTouchPoints((prev) => [...prev.slice(-45), newPoint]);
    triggerSparks(clampedX, clampedY);

    // Calculate grid cell touch
    const colWidth = width / GRID_COLS;
    const rowHeight = height / GRID_ROWS;
    const col = Math.floor(clampedX / colWidth);
    const row = Math.floor(clampedY / rowHeight);
    const cellId = Math.min(TOTAL_GRID_CELLS - 1, row * GRID_COLS + col);

    if (!gridCellsRef.current.has(cellId)) {
      gridCellsRef.current.add(cellId);
      const clearedRatio = gridCellsRef.current.size / TOTAL_GRID_CELLS;
      const currentPercent = Math.min(100, Math.round(clearedRatio * 100));
      setScratchedPercent(currentPercent);

      // Light haptic tick on new area scratched
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});

      if (clearedRatio >= autoRevealThreshold && !isRevealedRef.current) {
        triggerReveal();
      }
    }
  };

  const triggerReveal = () => {
    if (isRevealedRef.current) return;
    isRevealedRef.current = true;
    setIsRevealed(true);

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});

    // Pop scale animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.04,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Fade out foil coating
    Animated.timing(revealAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      if (onComplete) onComplete();
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: handleTouch,
      onPanResponderMove: handleTouch,
      onPanResponderRelease: () => {
        if (gridCellsRef.current.size >= 3 && !isRevealedRef.current) {
          if (scratchedPercent >= 30) {
            triggerReveal();
          }
        }
      },
    })
  ).current;

  const shimmerTranslateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width * 1.5],
  });

  return (
    <Animated.View
      style={[
        styles.cardOuterFrame,
        {
          width,
          height,
          transform: [{ scale: scaleAnim }],
          borderColor: theme.borderColor,
          shadowColor: theme.borderColor,
        },
      ]}
    >
      <View style={[styles.cardContainer, { width, height }]}>
        {/* REVEALED REWARD SURFACE */}
        <View style={styles.revealedSurface}>
          <LinearGradient colors={theme.gradientColors} style={styles.revealedGradient}>
            {/* Rarity Tag */}
            <View style={[styles.rarityBadge, { backgroundColor: theme.badgeBg, borderColor: theme.borderColor }]}>
              <Ionicons name="sparkles" size={12} color={theme.textColor} style={{ marginRight: 4 }} />
              <Text style={[styles.rarityBadgeText, { color: theme.textColor }]}>{theme.badgeLabel}</Text>
            </View>

            {/* Reward Icon */}
            <View style={[styles.rewardIconBadge, { borderColor: theme.borderColor, backgroundColor: theme.badgeBg }]}>
              <MaterialCommunityIcons name={iconName} size={36} color={theme.textColor} />
            </View>

            {/* Reward Texts */}
            <Text style={[styles.rewardText, { color: theme.textColor }]}>{rewardText}</Text>
            <Text style={styles.rewardSubtext}>{rewardSubtitle}</Text>

            {/* Unlocked Checkmark */}
            <View style={styles.unlockedRow}>
              <Ionicons name="checkmark-circle" size={14} color="#10B981" />
              <Text style={styles.unlockedText}>REWARD REVEALED</Text>
            </View>
          </LinearGradient>
        </View>

        {/* UNREVEALED METALLIC FOIL COATING */}
        {!isRevealed && (
          <Animated.View style={[styles.foilCoating, { opacity: revealAnim }]} {...panResponder.panHandlers}>
            <LinearGradient colors={['#27272A', '#18181B', '#09090B']} style={styles.foilGradient}>
              {/* Metallic Rune Pattern & Shimmer */}
              <Animated.View
                style={[
                  styles.shimmerSweep,
                  {
                    transform: [{ translateX: shimmerTranslateX }, { rotate: '25deg' }],
                  },
                ]}
              />

              {/* Scratched Trails (SVG Erase Masks) */}
              <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
                <Defs>
                  <SvgGradient id="scratchGlow" x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0%" stopColor={theme.borderColor} stopOpacity="0.4" />
                    <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.1" />
                  </SvgGradient>
                </Defs>
                {touchPoints.map((pt) => (
                  <Circle key={pt.id} cx={pt.x} cy={pt.y} r={32} fill="url(#scratchGlow)" />
                ))}
              </Svg>

              {/* Sparkle Emitter Component */}
              <ScratchSparkles sparks={sparkList} width={width} height={height} />

              {/* Centered CTA Pill */}
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <TouchableOpacity activeOpacity={0.85} onPress={triggerReveal} style={[styles.scratchButtonPill, { borderColor: theme.borderColor }]}>
                  <FontAwesome5 name="hand-pointer" size={13} color={theme.textColor} />
                  <Text style={styles.scratchButtonText}>SCRATCH TO REVEAL</Text>
                </TouchableOpacity>
              </Animated.View>

              {/* Progress Indicator */}
              <View style={styles.foilFooterRow}>
                <Text style={styles.hintText}>Drag finger or tap to reveal</Text>
                {scratchedPercent > 0 && (
                  <View style={styles.progressChip}>
                    <Text style={[styles.progressChipText, { color: theme.textColor }]}>{scratchedPercent}% CLEARED</Text>
                  </View>
                )}
              </View>
            </LinearGradient>
          </Animated.View>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardOuterFrame: {
    alignSelf: 'center',
    marginVertical: 14,
    borderRadius: 22,
    borderWidth: 1.5,
    backgroundColor: '#0D0D10',
    position: 'relative',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 8,
  },
  cardContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  revealedSurface: {
    ...StyleSheet.absoluteFillObject,
  },
  revealedGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  rarityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  rarityBadgeText: {
    fontFamily: fontFamilies.bold,
    fontSize: 9,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  rewardIconBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  rewardText: {
    fontFamily: fontFamilies.bold,
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  rewardSubtext: {
    fontFamily: fontFamilies.medium,
    color: '#9CA3AF',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  unlockedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  unlockedText: {
    fontFamily: fontFamilies.bold,
    color: '#10B981',
    fontSize: 10,
    letterSpacing: 1,
  },
  foilCoating: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },
  foilGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    position: 'relative',
  },
  shimmerSweep: {
    position: 'absolute',
    top: -50,
    bottom: -50,
    width: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  scratchButtonPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(24, 24, 27, 0.95)',
    borderWidth: 1.5,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  scratchButtonText: {
    fontFamily: fontFamilies.bold,
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  foilFooterRow: {
    position: 'absolute',
    bottom: 10,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hintText: {
    fontFamily: fontFamilies.regular,
    color: '#71717A',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  progressChip: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  progressChipText: {
    fontFamily: fontFamilies.bold,
    fontSize: 9,
    letterSpacing: 0.8,
  },
});
