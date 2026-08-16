import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import Svg, {
  Polygon,
  Circle,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
} from 'react-native-svg';
import { fontFamilies } from '../../theme/typography';

interface HexagonBadgeProps {
  level?: number;
  rankTitle?: string;
  size?: number;
}

export const HexagonBadge: React.FC<HexagonBadgeProps> = ({
  level = 12,
  rankTitle = 'CURRENT RANK',
  size = 280,
}) => {
  const floatY = useSharedValue(0);
  const auraScale = useSharedValue(1);

  useEffect(() => {
    // Gentle floating badge animation
    floatY.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 1600, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 1600, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    // Pulsing aura ring scale
    auraScale.value = withRepeat(
      withSequence(
        withTiming(1.18, { duration: 1400 }),
        withTiming(0.96, { duration: 1400 })
      ),
      -1,
      true
    );
  }, []);

  const animatedFloatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  const animatedAuraStyle = useAnimatedStyle(() => ({
    transform: [{ scale: auraScale.value }],
  }));

  const height = size * 1.15;
  const strokeWidth = 3;
  const innerStrokeWidth = 1.5;

  const cx = size / 2;
  const cy = height / 2;
  const rOuter = size / 2 - 10;
  const rInner = rOuter - 14;

  const getHexPoints = (r: number) => {
    const points: string[] = [];
    for (let i = 0; i < 6; i++) {
      const angleDeg = 60 * i - 30; // Pointy topped hexagon
      const angleRad = (Math.PI / 180) * angleDeg;
      const x = cx + r * Math.cos(angleRad);
      const y = cy + r * Math.sin(angleRad);
      points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
    }
    return points.join(' ');
  };

  const outerPoints = getHexPoints(rOuter);
  const innerPoints = getHexPoints(rInner);

  return (
    <View style={[styles.container, { width: size + 40, height: height + 40 }]}>
      {/* Background Radial Glow */}
      <Animated.View style={[styles.absoluteCenter, animatedAuraStyle]}>
        <Svg width={size * 1.3} height={height * 1.3} viewBox="0 0 300 300">
          <Defs>
            <RadialGradient id="badgeAura" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="#F59E0B" stopOpacity="0.5" />
              <Stop offset="40%" stopColor="#D97706" stopOpacity="0.25" />
              <Stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Circle cx="150" cy="150" r="140" fill="url(#badgeAura)" />
        </Svg>
      </Animated.View>

      {/* Floating Sparkles */}
      <View style={styles.absoluteCenter}>
        <Svg width={size + 20} height={height + 20} viewBox="0 0 300 300">
          <Circle cx="30" cy="80" r="3" fill="#FBBF24" opacity="0.8" />
          <Circle cx="270" cy="100" r="2.5" fill="#F59E0B" opacity="0.9" />
          <Circle cx="50" cy="220" r="2" fill="#FBBF24" opacity="0.85" />
          <Circle cx="250" cy="240" r="3.5" fill="#D97706" opacity="0.75" />
          <Circle cx="150" cy="20" r="2" fill="#FFE066" opacity="0.9" />
        </Svg>
      </View>

      {/* Floating Main Hexagon Badge */}
      <Animated.View
        style={[
          styles.badgeWrapper,
          { width: size, height },
          animatedFloatStyle,
        ]}
      >
        <Svg width={size} height={height} style={StyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#FFE259" />
              <Stop offset="50%" stopColor="#FFA751" />
              <Stop offset="100%" stopColor="#E67E22" />
            </LinearGradient>
            <LinearGradient id="innerGlow" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#241E12" stopOpacity="0.95" />
              <Stop offset="50%" stopColor="#141009" stopOpacity="0.98" />
              <Stop offset="100%" stopColor="#0B0907" stopOpacity="1" />
            </LinearGradient>
            <LinearGradient id="borderShine" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#F9D423" />
              <Stop offset="40%" stopColor="#FF4E50" stopOpacity="0.4" />
              <Stop offset="100%" stopColor="#F9D423" />
            </LinearGradient>
          </Defs>

          {/* Outer Hexagon */}
          <Polygon
            points={outerPoints}
            fill="url(#innerGlow)"
            stroke="url(#goldGrad)"
            strokeWidth={strokeWidth}
          />

          {/* Inner Accent Hexagon */}
          <Polygon
            points={innerPoints}
            fill="transparent"
            stroke="url(#borderShine)"
            strokeWidth={innerStrokeWidth}
            strokeDasharray="8, 4"
          />
        </Svg>

        {/* Center Rank & Level Details */}
        <View style={styles.content}>
          <Text style={styles.rankLabel}>{rankTitle}</Text>
          <Text style={styles.levelText}>LEVEL {level}</Text>
          <View style={styles.underline} />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    position: 'relative',
    marginVertical: 12,
  },
  absoluteCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  badgeWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 10,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 15,
  },
  rankLabel: {
    fontFamily: fontFamilies.bold,
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 8,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  levelText: {
    fontFamily: fontFamilies.bold,
    color: '#F59E0B',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 2.5,
    textShadowColor: 'rgba(245, 158, 11, 0.75)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 18,
    textAlign: 'center',
  },
  underline: {
    width: 32,
    height: 3,
    backgroundColor: '#F59E0B',
    borderRadius: 2,
    marginTop: 8,
  },
});
