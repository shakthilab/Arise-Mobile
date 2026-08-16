import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import Svg, {
  Rect,
  Path,
  Circle,
  Ellipse,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  G,
} from 'react-native-svg';

interface TreasureChestProps {
  size?: number;
}

export const TreasureChestVisual: React.FC<TreasureChestProps> = ({ size = 260 }) => {
  const floatY = useSharedValue(0);
  const glowPulse = useSharedValue(1);

  useEffect(() => {
    floatY.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 1800, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 1800, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    glowPulse.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 1200 }),
        withTiming(0.95, { duration: 1200 })
      ),
      -1,
      true
    );
  }, []);

  const animatedChestStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  const animatedGlowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowPulse.value }],
  }));

  return (
    <View style={[styles.container, { width: size, height: size * 0.9 }]}>
      {/* Background Fiery Aura Glow */}
      <Animated.View style={[styles.absoluteCenter, animatedGlowStyle]}>
        <Svg width={size * 1.3} height={size * 1.3} viewBox="0 0 300 300">
          <Defs>
            <RadialGradient id="fireAura" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="#FF5722" stopOpacity="0.75" />
              <Stop offset="35%" stopColor="#F97316" stopOpacity="0.4" />
              <Stop offset="70%" stopColor="#D97706" stopOpacity="0.15" />
              <Stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Circle cx="150" cy="150" r="140" fill="url(#fireAura)" />
        </Svg>
      </Animated.View>

      {/* Floating Ember Particles */}
      <View style={styles.absoluteCenter}>
        <Svg width={size} height={size} viewBox="0 0 260 260">
          <Circle cx="40" cy="180" r="2.5" fill="#FF7D00" opacity="0.8" />
          <Circle cx="70" cy="120" r="1.8" fill="#FFAA00" opacity="0.9" />
          <Circle cx="220" cy="160" r="3" fill="#FF5722" opacity="0.85" />
          <Circle cx="200" cy="90" r="2" fill="#FFB703" opacity="0.9" />
          <Circle cx="130" cy="40" r="2.2" fill="#FF7D00" opacity="0.7" />
          <Circle cx="90" cy="70" r="1.5" fill="#FF5722" opacity="0.75" />
        </Svg>
      </View>

      {/* Fiery Rune Floor Platform / Magic Circle */}
      <View style={styles.floorPlatform}>
        <Svg width={size * 1.15} height={size * 0.45} viewBox="0 0 280 120">
          <Defs>
            <RadialGradient id="floorGlow" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="#FF6000" stopOpacity="0.85" />
              <Stop offset="60%" stopColor="#D97706" stopOpacity="0.3" />
              <Stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </RadialGradient>
            <LinearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#FF4500" />
              <Stop offset="50%" stopColor="#FFB703" />
              <Stop offset="100%" stopColor="#FF4500" />
            </LinearGradient>
          </Defs>
          {/* Base Radial Floor Glow */}
          <Ellipse cx="140" cy="60" rx="120" ry="45" fill="url(#floorGlow)" />

          {/* Concentric Rune Rings */}
          <Ellipse
            cx="140"
            cy="60"
            rx="110"
            ry="40"
            fill="none"
            stroke="url(#ringGrad)"
            strokeWidth="2.5"
            strokeDasharray="6, 3"
          />
          <Ellipse
            cx="140"
            cy="60"
            rx="95"
            ry="34"
            fill="none"
            stroke="#FF7D00"
            strokeWidth="1.5"
          />
          <Ellipse
            cx="140"
            cy="60"
            rx="75"
            ry="26"
            fill="none"
            stroke="url(#ringGrad)"
            strokeWidth="1"
            strokeDasharray="12, 6"
          />

          {/* Crosshair Ornaments */}
          <Path d="M 140 15 L 140 105 M 30 60 L 250 60" stroke="#FF7D00" strokeWidth="0.8" opacity="0.6" />
        </Svg>
      </View>

      {/* Main Heavy Metallic Molten Treasure Chest */}
      <Animated.View style={[styles.chestWrapper, animatedChestStyle]}>
        <Svg width={230} height={170} viewBox="0 0 230 170">
          <Defs>
            {/* Metallic Iron Lid Gradient */}
            <LinearGradient id="ironLid" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#6B7280" />
              <Stop offset="30%" stopColor="#374151" />
              <Stop offset="70%" stopColor="#1F2937" />
              <Stop offset="100%" stopColor="#111827" />
            </LinearGradient>

            {/* Dark Obsidian Base Gradient */}
            <LinearGradient id="ironBase" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#27272A" />
              <Stop offset="40%" stopColor="#18181B" />
              <Stop offset="100%" stopColor="#09090B" />
            </LinearGradient>

            {/* Molten Glow Seam */}
            <LinearGradient id="moltenGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#FF4500" />
              <Stop offset="25%" stopColor="#FF8C00" />
              <Stop offset="50%" stopColor="#FFD700" />
              <Stop offset="75%" stopColor="#FF8C00" />
              <Stop offset="100%" stopColor="#FF4500" />
            </LinearGradient>

            {/* Metallic Steel Band */}
            <LinearGradient id="steelBand" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#4B5563" />
              <Stop offset="50%" stopColor="#9CA3AF" />
              <Stop offset="100%" stopColor="#374151" />
            </LinearGradient>

            {/* Gold Crest Gradient */}
            <LinearGradient id="crestGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#FFE066" />
              <Stop offset="50%" stopColor="#F59E0B" />
              <Stop offset="100%" stopColor="#B45309" />
            </LinearGradient>
          </Defs>

          {/* Chest Shadow */}
          <Ellipse cx="115" cy="162" rx="85" ry="10" fill="#000" opacity="0.6" />

          {/* Chest Lower Body Base */}
          <Rect x="25" y="70" width="180" height="85" rx="12" fill="url(#ironBase)" stroke="#4B5563" strokeWidth="2" />

          {/* Vertical Metallic Steel Reinforcement Straps */}
          <Rect x="45" y="70" width="22" height="85" fill="url(#steelBand)" />
          <Rect x="163" y="70" width="22" height="85" fill="url(#steelBand)" />

          {/* Molten Burning Seam Split Line */}
          <Rect x="20" y="65" width="190" height="8" rx="4" fill="url(#moltenGlow)" />

          {/* Smooth Curved Metallic Lid */}
          <Path
            d="M 25 67 Q 115 15, 205 67 Z"
            fill="url(#ironLid)"
            stroke="#6B7280"
            strokeWidth="2.5"
          />

          {/* Lid Steel Bands */}
          <Path d="M 45 67 Q 56 26, 67 67 Z" fill="url(#steelBand)" />
          <Path d="M 163 67 Q 174 26, 185 67 Z" fill="url(#steelBand)" />

          {/* Corner Rivets */}
          <Circle cx="56" cy="80" r="2.5" fill="#E5E7EB" />
          <Circle cx="56" cy="140" r="2.5" fill="#E5E7EB" />
          <Circle cx="174" cy="80" r="2.5" fill="#E5E7EB" />
          <Circle cx="174" cy="140" r="2.5" fill="#E5E7EB" />

          {/* Central Molten Crest Emblem (Rhombus / Diamond) */}
          <G transform="translate(115, 68)">
            {/* Outer Diamond Frame */}
            <Path
              d="M 0 -28 L 24 0 L 0 28 L -24 0 Z"
              fill="url(#ironBase)"
              stroke="url(#crestGold)"
              strokeWidth="3.5"
            />
            {/* Inner Fiery Core Diamond */}
            <Path
              d="M 0 -18 L 15 0 L 0 18 L -15 0 Z"
              fill="url(#moltenGlow)"
            />
            {/* Center Star Flare */}
            <Path
              d="M 0 -12 L 3 -3 L 12 0 L 3 3 L 0 12 L -3 3 L -12 0 L -3 -3 Z"
              fill="#FFFFFF"
            />
          </G>
        </Svg>
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
    marginVertical: 8,
  },
  absoluteCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  floorPlatform: {
    position: 'absolute',
    bottom: -10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  chestWrapper: {
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
});
