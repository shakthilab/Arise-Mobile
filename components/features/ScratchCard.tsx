import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  GestureResponderEvent,
  TouchableOpacity,
  Animated,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { MaterialCommunityIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import { fontFamilies } from '../../theme/typography';

interface ScratchCardProps {
  onComplete: () => void;
  rewardText?: string;
  rewardSubtitle?: string;
}

interface TouchPoint {
  id: string;
  x: number;
  y: number;
}

export const ScratchCard: React.FC<ScratchCardProps> = ({
  onComplete,
  rewardText = '+100 EXP',
  rewardSubtitle = 'Hunter Rank XP Booster',
}) => {
  const [touchPoints, setTouchPoints] = useState<TouchPoint[]>([]);
  const [isRevealed, setIsRevealed] = useState(false);
  const revealAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const gridCellsRef = useRef<Set<number>>(new Set());

  const THRESHOLD = 6; // Low threshold for effortless scratch

  useEffect(() => {
    // Subtle breathing pulse on button
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.04,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleTouch = (evt: GestureResponderEvent) => {
    if (isRevealed) return;

    const { locationX, locationY } = evt.nativeEvent;
    const cardWidth = 310;
    const cardHeight = 150;

    const newPoint = {
      id: `${Date.now()}-${Math.random()}`,
      x: Math.max(0, Math.min(cardWidth, locationX)),
      y: Math.max(0, Math.min(cardHeight, locationY)),
    };

    setTouchPoints((prev) => [...prev.slice(-30), newPoint]);

    const col = Math.floor(Math.max(0, Math.min(cardWidth - 1, locationX)) / (cardWidth / 4));
    const row = Math.floor(Math.max(0, Math.min(cardHeight - 1, locationY)) / (cardHeight / 4));
    const cellId = row * 4 + col;

    if (!gridCellsRef.current.has(cellId)) {
      gridCellsRef.current.add(cellId);
      const count = gridCellsRef.current.size;

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});

      if (count >= THRESHOLD && !isRevealed) {
        triggerReveal();
      }
    }
  };

  const triggerReveal = () => {
    if (isRevealed) return;
    setIsRevealed(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    Animated.timing(revealAnim, {
      toValue: 0,
      duration: 350,
      useNativeDriver: true,
    }).start(() => {
      onComplete();
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: handleTouch,
      onPanResponderMove: handleTouch,
      onPanResponderRelease: () => {
        if (gridCellsRef.current.size >= 2 && !isRevealed) {
          triggerReveal();
        }
      },
    })
  ).current;

  return (
    <View style={styles.cardOuterFrame}>
      <View style={styles.cardContainer}>
        {/* REVEALED REWARD SURFACE */}
        <View style={styles.revealedSurface}>
          <LinearGradient
            colors={['#1E1609', '#120E06', '#090703']}
            style={styles.revealedGradient}
          >
            <View style={styles.rewardIconBadge}>
              <MaterialCommunityIcons name="trophy-award" size={32} color="#F59E0B" />
            </View>
            <Text style={styles.rewardText}>{rewardText}</Text>
            <Text style={styles.rewardSubtext}>{rewardSubtitle}</Text>
          </LinearGradient>
        </View>

        {/* UNREVEALED SIMPLE FOIL COATING */}
        {!isRevealed && (
          <Animated.View
            style={[styles.foilCoating, { opacity: revealAnim }]}
            {...panResponder.panHandlers}
          >
            <LinearGradient
              colors={['#1F1F24', '#141418', '#0D0D10']}
              style={styles.foilGradient}
            >
              {/* Real-time Touch Scratch Trail */}
              <Svg width={310} height={150} style={StyleSheet.absoluteFill}>
                {touchPoints.map((pt) => (
                  <Circle key={pt.id} cx={pt.x} cy={pt.y} r={28} fill="#F59E0B" opacity={0.4} />
                ))}
              </Svg>

              {/* Centered Simple CTA Button */}
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={triggerReveal}
                  style={styles.scratchButtonPill}
                >
                  <FontAwesome5 name="hand-pointer" size={14} color="#F59E0B" />
                  <Text style={styles.scratchButtonText}>SCRATCH TO REVEAL</Text>
                </TouchableOpacity>
              </Animated.View>

              {/* Minimal Bottom Hint */}
              <Text style={styles.hintText}>Drag finger or tap to reveal</Text>
            </LinearGradient>
          </Animated.View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardOuterFrame: {
    alignSelf: 'center',
    marginVertical: 14,
  },
  cardContainer: {
    width: 310,
    height: 150,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#D97706',
    backgroundColor: '#0D0D10',
    position: 'relative',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
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
  rewardIconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  rewardText: {
    fontFamily: fontFamilies.bold,
    color: '#F59E0B',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 2,
  },
  rewardSubtext: {
    fontFamily: fontFamilies.medium,
    color: '#9CA3AF',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
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
    gap: 10,
  },
  scratchButtonPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#18181B',
    borderWidth: 1.5,
    borderColor: '#F59E0B',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  scratchButtonText: {
    fontFamily: fontFamilies.bold,
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  hintText: {
    fontFamily: fontFamilies.regular,
    color: '#71717A',
    fontSize: 10,
    letterSpacing: 0.5,
  },
});
