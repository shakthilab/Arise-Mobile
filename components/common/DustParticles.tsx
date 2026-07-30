import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

type DustParticlesProps = {
  count?: number;
};

type ParticleData = {
  xPct: number;
  startYPct: number;
  size: number;
  opacityVal: number;
  duration: number;
  swayAmount: number;
  initialProgress: number;
};

function DustParticlesComponent({ count = 20 }: DustParticlesProps) {
  // Generate random configuration for continuous floating dust particles
  const particlesConfig = useRef<ParticleData[]>(
    Array.from({ length: count }, () => ({
      xPct: Math.random() * 94 + 3, // 3% to 97% width
      startYPct: Math.random() * 80 + 10, // 10% to 90% height
      size: Math.random() * 3 + 1.5, // 1.5px to 4.5px
      opacityVal: Math.random() * 0.6 + 0.35, // 0.35 to 0.95 opacity
      duration: Math.random() * 3500 + 4000, // 4s to 7.5s loop duration
      swayAmount: (Math.random() - 0.5) * 35, // -17.5px to +17.5px horizontal sway
      initialProgress: Math.random(), // Already floating in air on mount!
    }))
  ).current;

  const animProgress = useRef(
    particlesConfig.map((p) => new Animated.Value(p.initialProgress))
  ).current;

  useEffect(() => {
    const animations = animProgress.map((anim, index) => {
      const config = particlesConfig[index];

      // First animate from initial progress to 1
      const remainingRatio = 1 - config.initialProgress;
      const initialDuration = config.duration * remainingRatio;

      const firstCycle = Animated.timing(anim, {
        toValue: 1,
        duration: initialDuration,
        easing: Easing.linear,
        useNativeDriver: true,
      });

      const loopCycle = Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 1,
            duration: config.duration,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      );

      return Animated.sequence([firstCycle, loopCycle]);
    });

    animations.forEach((a) => a.start());

    return () => {
      animations.forEach((a) => a.stop());
    };
  }, [animProgress, particlesConfig]);

  return (
    <View style={styles.container} pointerEvents="none">
      {particlesConfig.map((p, index) => {
        const anim = animProgress[index];

        const translateY = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [60, -250],
        });

        const translateX = anim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, p.swayAmount, 0],
        });

        const opacity = anim.interpolate({
          inputRange: [0, 0.2, 0.8, 1],
          outputRange: [0, p.opacityVal, p.opacityVal * 0.8, 0],
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.particle,
              {
                left: `${p.xPct}%`,
                top: `${p.startYPct}%`,
                width: p.size,
                height: p.size,
                borderRadius: p.size / 2,
                opacity,
                transform: [{ translateY }, { translateX }],
              },
            ]}
          />
        );
      })}
    </View>
  );
}

export const DustParticles = React.memo(DustParticlesComponent);

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  particle: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.95,
    shadowRadius: 4,
  },
});

