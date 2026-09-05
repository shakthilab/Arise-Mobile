import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, View } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import type { StreakFireProps, StreakReminderStage } from './types';

const FIRE_IMAGE = require('@/assets/images/fireimagetwo.png');

interface DiamondSparkData {
  xOffset: number;
  startY: number;
  size: number;
  duration: number;
  swayAmount: number;
  color: string;
}

// Gentle, slow-moving fire sparkles around the fire
const SLOW_SPARKS_CONFIG: DiamondSparkData[] = [
  { xOffset: -60, startY: 30, size: 7, duration: 4200, swayAmount: 12, color: '#FFA000' },
  { xOffset: -40, startY: 45, size: 6, duration: 4800, swayAmount: -10, color: '#FFD54F' },
  { xOffset: -22, startY: 20, size: 8, duration: 3800, swayAmount: 14, color: '#FF5500' },
  { xOffset: -5, startY: 40, size: 9, duration: 4500, swayAmount: -12, color: '#FFE082' },
  { xOffset: 18, startY: 25, size: 7, duration: 4000, swayAmount: 10, color: '#FFA000' },
  { xOffset: 38, startY: 50, size: 6, duration: 5000, swayAmount: -14, color: '#FFD54F' },
  { xOffset: 62, startY: 35, size: 8, duration: 4300, swayAmount: 12, color: '#FF5500' },
  { xOffset: -50, startY: 60, size: 5, duration: 5400, swayAmount: -8, color: '#FF9100' },
  { xOffset: 50, startY: 55, size: 5, duration: 5200, swayAmount: 8, color: '#FFE082' },
  { xOffset: -12, startY: 65, size: 6, duration: 4600, swayAmount: 10, color: '#FF5500' },
  { xOffset: 15, startY: 60, size: 7, duration: 4400, swayAmount: -10, color: '#FFA000' },
];

export function StreakFireVisual({
  stage = 'active_warning',
  size = 185,
  scale = 1,
  showParticles = true,
  style,
}: StreakFireProps) {
  // Spark progress values for slow continuous rising loops
  const sparkAnims = useRef(SLOW_SPARKS_CONFIG.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    // Continuous Slow Rising Loops for Sparkles Only
    const sparkLoops = sparkAnims.map((anim, index) => {
      const config = SLOW_SPARKS_CONFIG[index];
      const initialDelay = (index * 320) % 1500;

      return Animated.loop(
        Animated.sequence([
          Animated.delay(initialDelay),
          Animated.timing(anim, {
            toValue: 1,
            duration: config.duration,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );
    });

    sparkLoops.forEach((l) => l.start());

    return () => {
      sparkLoops.forEach((l) => l.stop());
    };
  }, [stage]);

  const activeSparkCount = stage === 'active_warning' ? SLOW_SPARKS_CONFIG.length : stage === 'weak' ? 6 : 3;

  return (
    <View style={[styles.wrapper, { width: size * 1.3, height: size * 1.3 }, style]}>
      {/* 1. SLOWLY FLOATING FIRE SPARKLES ONLY */}
      {showParticles && (
        <View style={styles.particlesContainer} pointerEvents="none">
          {SLOW_SPARKS_CONFIG.slice(0, activeSparkCount).map((config, i) => {
            const anim = sparkAnims[i];

            // Gentle slow vertical rise
            const sparkTranslateY = anim.interpolate({
              inputRange: [0, 1],
              outputRange: [config.startY, -100 - (i % 3) * 15],
            });

            // Gentle slow horizontal sway
            const sparkTranslateX = anim.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [config.xOffset, config.xOffset + config.swayAmount, config.xOffset],
            });

            // Smooth fade in & fade out
            const sparkOpacity = anim.interpolate({
              inputRange: [0, 0.2, 0.75, 1],
              outputRange: [0, 0.9, 0.7, 0],
            });

            // Subtle scale variation
            const sparkScale = anim.interpolate({
              inputRange: [0, 0.35, 1],
              outputRange: [0.5, 1.1, 0.3],
            });

            // Slow gentle rotation
            const sparkRotate = anim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '180deg'],
            });

            return (
              <Animated.View
                key={`slow-spark-${stage}-${i}`}
                style={[
                  styles.diamondWrapper,
                  {
                    opacity: sparkOpacity,
                    transform: [
                      { translateX: sparkTranslateX },
                      { translateY: sparkTranslateY },
                      { scale: sparkScale },
                      { rotate: sparkRotate },
                    ],
                  },
                ]}
              >
                <Svg width={config.size} height={config.size * 1.4} viewBox="0 0 10 14" fill="none">
                  <Polygon
                    points="5,0 10,7 5,14 0,7"
                    fill={config.color}
                    opacity={stage === 'lost' ? 0.55 : 0.95}
                  />
                </Svg>
              </Animated.View>
            );
          })}
        </View>
      )}

      {/* 2. STATIC, CRISP FIRE IMAGE (No whole-image distortion) */}
      <View style={styles.imageContainer}>
        <Image
          source={FIRE_IMAGE}
          style={[
            styles.fireImage,
            {
              width: size,
              height: size * 1.18,
              opacity: stage === 'lost' ? 0.75 : stage === 'weak' ? 0.9 : 1.0,
            },
          ]}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  particlesContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  diamondWrapper: {
    position: 'absolute',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  fireImage: {
    alignSelf: 'center',
  },
});
