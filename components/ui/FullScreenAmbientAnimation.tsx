import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import Svg, { Circle, Path, Defs, RadialGradient, Stop } from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const RAY_SIZE = Math.max(SCREEN_WIDTH, SCREEN_HEIGHT) * 2.2;

export const FullScreenAmbientAnimation: React.FC = () => {
  const rotateVal = useSharedValue(0);
  const pulseVal = useSharedValue(1);
  const floatY = useSharedValue(0);

  useEffect(() => {
    rotateVal.value = withRepeat(
      withTiming(360, { duration: 28000, easing: Easing.linear }),
      -1,
      false
    );

    pulseVal.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 2200, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.95, { duration: 2200, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    floatY.value = withRepeat(
      withSequence(
        withTiming(-15, { duration: 2400, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 2400, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );
  }, []);

  const animatedRotate = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotateVal.value}deg` }],
  }));

  const animatedPulse = useAnimatedStyle(() => ({
    transform: [{ scale: pulseVal.value }],
  }));

  const animatedFloat = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  return (
    <View style={styles.fullScreenWrapper} pointerEvents="none">
      {/* Full-Screen Radial Gold Aura Pulse */}
      <Animated.View style={[styles.centered, animatedPulse]}>
        <Svg width={RAY_SIZE} height={RAY_SIZE} viewBox="0 0 500 500">
          <Defs>
            <RadialGradient id="screenAura" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="#F59E0B" stopOpacity="0.3" />
              <Stop offset="40%" stopColor="#D97706" stopOpacity="0.15" />
              <Stop offset="80%" stopColor="#7C2D12" stopOpacity="0.05" />
              <Stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Circle cx="250" cy="250" r="240" fill="url(#screenAura)" />
        </Svg>
      </Animated.View>

      {/* True Full-Screen 360 Rotating Rays (Extends to all screen corners) */}
      <Animated.View style={[styles.centered, animatedRotate]}>
        <Svg width={RAY_SIZE} height={RAY_SIZE} viewBox="0 0 500 500">
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = i * 30;
            return (
              <Path
                key={i}
                d="M 250 250 L 230 -200 L 270 -200 Z"
                fill="#FBBF24"
                opacity="0.15"
                transform={`rotate(${angle}, 250, 250)`}
              />
            );
          })}
        </Svg>
      </Animated.View>

      {/* Floating Sparkles across Full Screen */}
      <Animated.View style={[styles.fullScreenWrapper, animatedFloat]}>
        <Svg width={SCREEN_WIDTH} height={SCREEN_HEIGHT} viewBox={`0 0 ${SCREEN_WIDTH} ${SCREEN_HEIGHT}`}>
          <Circle cx={SCREEN_WIDTH * 0.12} cy={SCREEN_HEIGHT * 0.15} r="3.5" fill="#FBBF24" opacity="0.8" />
          <Circle cx={SCREEN_WIDTH * 0.88} cy={SCREEN_HEIGHT * 0.18} r="2.8" fill="#F59E0B" opacity="0.85" />
          <Circle cx={SCREEN_WIDTH * 0.18} cy={SCREEN_HEIGHT * 0.55} r="2.2" fill="#FFE066" opacity="0.8" />
          <Circle cx={SCREEN_WIDTH * 0.82} cy={SCREEN_HEIGHT * 0.65} r="3.8" fill="#F97316" opacity="0.75" />
          <Circle cx={SCREEN_WIDTH * 0.5} cy={SCREEN_HEIGHT * 0.08} r="3" fill="#FBBF24" opacity="0.9" />
          <Circle cx={SCREEN_WIDTH * 0.28} cy={SCREEN_HEIGHT * 0.88} r="2.5" fill="#D97706" opacity="0.75" />
          <Circle cx={SCREEN_WIDTH * 0.75} cy={SCREEN_HEIGHT * 0.38} r="3.2" fill="#F59E0B" opacity="0.8" />
          <Circle cx={SCREEN_WIDTH * 0.08} cy={SCREEN_HEIGHT * 0.78} r="2.8" fill="#FBBF24" opacity="0.7" />
          <Circle cx={SCREEN_WIDTH * 0.92} cy={SCREEN_HEIGHT * 0.82} r="3" fill="#F97316" opacity="0.8" />
        </Svg>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  centered: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
