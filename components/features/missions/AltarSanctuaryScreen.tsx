import React, { useEffect } from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';

import { QuestItem } from '@/app/(tabs)/index';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// 24 Floating Violet / Mana Ember Particles
const PARTICLE_COUNT = 24;
const PARTICLES = Array.from({ length: PARTICLE_COUNT }).map((_, i) => ({
  id: i,
  startX: SCREEN_WIDTH * 0.15 + Math.random() * (SCREEN_WIDTH * 0.7),
  startY: SCREEN_HEIGHT * 0.72 + (Math.random() * 40 - 20),
  size: Math.random() * 5 + 2.5,
  duration: Math.random() * 3200 + 2600,
  delay: Math.random() * 2500,
  driftX: (Math.random() - 0.5) * 60,
  color:
    i % 4 === 0
      ? '#D8B4FE' // Light Violet
      : i % 4 === 1
      ? '#A855F7' // Electric Purple
      : i % 4 === 2
      ? '#C084FC' // Bright Orchid
      : '#F472B6', // Radiant Pink-Purple
}));

function ManaEmberParticle({
  startX,
  startY,
  size,
  duration,
  delay,
  driftX,
  color,
}: (typeof PARTICLES)[0]) {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.4);

  useEffect(() => {
    const animate = () => {
      translateY.value = 0;
      translateX.value = 0;
      opacity.value = 0;
      scale.value = 0.4;

      opacity.value = withDelay(
        delay,
        withSequence(
          withTiming(0.9, { duration: 600 }),
          withTiming(0.8, { duration: duration - 1200 }),
          withTiming(0, { duration: 600 })
        )
      );

      scale.value = withDelay(
        delay,
        withSequence(
          withTiming(1.2, { duration: duration * 0.4 }),
          withTiming(0.2, { duration: duration * 0.6 })
        )
      );

      translateX.value = withDelay(
        delay,
        withTiming(driftX, {
          duration,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        })
      );

      translateY.value = withDelay(
        delay,
        withTiming(-SCREEN_HEIGHT * 0.45, {
          duration,
          easing: Easing.out(Easing.quad),
        })
      );
    };

    animate();
    const interval = setInterval(animate, duration + delay + 100);
    return () => clearInterval(interval);
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.emberParticle,
        {
          left: startX,
          top: startY,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          shadowColor: color,
        },
        animStyle,
      ]}
    />
  );
}

export interface AltarSanctuaryScreenProps {
  quests?: QuestItem[];
  onEnterGate: () => void;
  onClose?: () => void;
}

export function AltarSanctuaryScreen({
  onEnterGate,
  onClose,
}: AltarSanctuaryScreenProps) {
  // Screen fade in
  const screenFade = useSharedValue(0);
  const closeBtnOpacity = useSharedValue(0);

  // Dragon Egg Floating Up and Down Animations
  const eggTranslateY = useSharedValue(0);
  const eggScale = useSharedValue(1);
  const eggGlowPulse = useSharedValue(0.8);

  // Altar Rune Rings Rotations & Pulse
  const outerRingRotation = useSharedValue(0);
  const innerRingRotation = useSharedValue(0);
  const altarGlowPulse = useSharedValue(0.7);
  const manaPillarScale = useSharedValue(0.9);
  const manaPillarOpacity = useSharedValue(0.5);

  // Brazier flame glow pulse
  const brazierFlicker = useSharedValue(0.75);

  // Shockwave tap ripple
  const rippleScale = useSharedValue(0);
  const rippleOpacity = useSharedValue(0);

  useEffect(() => {
    // 1. Initial screen fade in
    screenFade.value = withTiming(1, { duration: 400 });
    closeBtnOpacity.value = withDelay(300, withTiming(1, { duration: 400 }));

    // 2. Slow, smooth Dragon Egg Levitation (up and down)
    eggTranslateY.value = withRepeat(
      withSequence(
        withTiming(-16, { duration: 2600, easing: Easing.inOut(Easing.quad) }),
        withTiming(14, { duration: 2600, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    // Subtle Egg Breathing Scale
    eggScale.value = withRepeat(
      withSequence(
        withTiming(1.04, { duration: 2600, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.97, { duration: 2600, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    // Egg Aura Glow Pulse
    eggGlowPulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.65, { duration: 1800, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    // 3. Continuous Magic Ring Rotations
    outerRingRotation.value = withRepeat(
      withTiming(360, { duration: 24000, easing: Easing.linear }),
      -1,
      false
    );
    innerRingRotation.value = withRepeat(
      withTiming(-360, { duration: 16000, easing: Easing.linear }),
      -1,
      false
    );

    // 4. Breathing Altar & Pillar Glow
    altarGlowPulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.65, { duration: 1800, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    manaPillarOpacity.value = withRepeat(
      withSequence(
        withTiming(0.85, { duration: 2200, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.4, { duration: 2200, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    manaPillarScale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 2200, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.92, { duration: 2200, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    // 5. Brazier Fire Flicker
    brazierFlicker.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 450, easing: Easing.bezier(0.4, 0, 0.6, 1) }),
        withTiming(0.6, { duration: 350, easing: Easing.bezier(0.4, 0, 0.6, 1) }),
        withTiming(0.9, { duration: 500, easing: Easing.bezier(0.4, 0, 0.6, 1) })
      ),
      -1,
      true
    );
  }, []);

  const triggerAltarShockwave = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    rippleScale.value = 0.2;
    rippleOpacity.value = 1;

    rippleScale.value = withTiming(2.2, {
      duration: 750,
      easing: Easing.out(Easing.cubic),
    });
    rippleOpacity.value = withTiming(0, {
      duration: 750,
      easing: Easing.out(Easing.quad),
    });
  };

  const handleDismiss = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onClose) onClose();
    else onEnterGate();
  };

  // Animated styles
  const screenAnimStyle = useAnimatedStyle(() => ({
    opacity: screenFade.value,
  }));

  const closeBtnAnimStyle = useAnimatedStyle(() => ({
    opacity: closeBtnOpacity.value,
  }));

  const eggFloatingStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: eggTranslateY.value },
      { scale: eggScale.value },
    ],
  }));

  const eggAuraStyle = useAnimatedStyle(() => ({
    opacity: eggGlowPulse.value,
    transform: [
      { scale: interpolate(eggGlowPulse.value, [0.65, 1], [0.95, 1.1]) },
    ],
  }));

  const eggShadowStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(
          eggTranslateY.value,
          [-16, 14],
          [0.8, 1.2]
        ),
      },
    ],
    opacity: interpolate(
      eggTranslateY.value,
      [-16, 14],
      [0.35, 0.75]
    ),
  }));

  const outerRingAnimStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${outerRingRotation.value}deg` }],
  }));

  const innerRingAnimStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${innerRingRotation.value}deg` }],
  }));

  const altarGlowAnimStyle = useAnimatedStyle(() => ({
    opacity: altarGlowPulse.value,
    transform: [{ scale: interpolate(altarGlowPulse.value, [0.65, 1], [0.95, 1.05]) }],
  }));

  const manaPillarAnimStyle = useAnimatedStyle(() => ({
    opacity: manaPillarOpacity.value,
    transform: [{ scaleY: manaPillarScale.value }],
  }));

  const brazierAnimStyle = useAnimatedStyle(() => ({
    opacity: brazierFlicker.value,
  }));

  const rippleAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: rippleScale.value }],
    opacity: rippleOpacity.value,
  }));

  return (
    <Modal
      animationType="fade"
      transparent={false}
      visible={true}
      onRequestClose={handleDismiss}
    >
      <Pressable style={styles.container} onPress={triggerAltarShockwave}>
        <Animated.View style={[StyleSheet.absoluteFillObject, screenAnimStyle]}>
          {/* BACKGROUND IMAGE - EPIC SANCTUARY ALTAR */}
          <Image
            source={require('@/assets/images/altar_sanctuary_bg.jpg')}
            style={StyleSheet.absoluteFillObject}
            contentFit="cover"
            transition={250}
          />

          {/* Subtle Ambient Vignette */}
          <LinearGradient
            colors={[
              'rgba(8, 6, 15, 0.4)',
              'transparent',
              'transparent',
              'rgba(8, 5, 18, 0.6)',
            ]}
            locations={[0, 0.25, 0.7, 1]}
            style={StyleSheet.absoluteFillObject}
          />

          {/* BRAZIER FLICKERING AMBIENT LIGHTS */}
          <Animated.View
            style={[styles.leftBrazierGlow, brazierAnimStyle]}
            pointerEvents="none"
          >
            <LinearGradient
              colors={['rgba(255, 120, 40, 0.45)', 'rgba(168, 85, 247, 0.15)', 'transparent']}
              style={StyleSheet.absoluteFillObject}
            />
          </Animated.View>

          <Animated.View
            style={[styles.rightBrazierGlow, brazierAnimStyle]}
            pointerEvents="none"
          >
            <LinearGradient
              colors={['rgba(255, 120, 40, 0.45)', 'rgba(168, 85, 247, 0.15)', 'transparent']}
              style={StyleSheet.absoluteFillObject}
            />
          </Animated.View>

          {/* RISING MANA EMBER PARTICLES */}
          <View style={styles.particleLayer} pointerEvents="none">
            {PARTICLES.map((p) => (
              <ManaEmberParticle key={p.id} {...p} />
            ))}
          </View>

          {/* TOP RIGHT CLOSE BUTTON */}
          <Animated.View style={[styles.topBar, closeBtnAnimStyle]}>
            <TouchableOpacity
              style={styles.closeButton}
              activeOpacity={0.7}
              onPress={handleDismiss}
            >
              <Ionicons name="close" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </Animated.View>

          {/* CENTER MAGIC RUNES & ALTAR ANIMATION */}
          <View style={styles.altarZone} pointerEvents="box-none">
            {/* Mana Light Pillar Rising from Altar Center */}
            <Animated.View
              style={[styles.manaPillarContainer, manaPillarAnimStyle]}
              pointerEvents="none"
            >
              <LinearGradient
                colors={[
                  'transparent',
                  'rgba(192, 132, 252, 0.12)',
                  'rgba(168, 85, 247, 0.35)',
                  'rgba(216, 180, 254, 0.65)',
                ]}
                locations={[0, 0.4, 0.75, 1]}
                style={StyleSheet.absoluteFillObject}
              />
            </Animated.View>

            {/* Interactive Tap Area on the Altar */}
            <Pressable
              style={styles.altarCircleInteractiveArea}
              onPress={triggerAltarShockwave}
            >
              {/* Pulsing Mana Bloom behind rune circle */}
              <Animated.View style={[styles.altarBloom, altarGlowAnimStyle]} />

              {/* Shockwave Ripple on Tap */}
              <Animated.View style={[styles.shockwaveRing, rippleAnimStyle]} />

              {/* Concentric Rotating Magic Rune Circles */}
              <View style={styles.magicCirclesWrapper}>
                {/* Outer Rune Ring */}
                <Animated.View style={[styles.outerRuneRing, outerRingAnimStyle]}>
                  <Svg width={240} height={240} viewBox="0 0 240 240">
                    <Circle
                      cx="120"
                      cy="120"
                      r="112"
                      stroke="#C084FC"
                      strokeWidth="1.8"
                      strokeDasharray="14 8 4 8"
                      strokeOpacity={0.8}
                      fill="none"
                    />
                    <Circle
                      cx="120"
                      cy="120"
                      r="98"
                      stroke="#A855F7"
                      strokeWidth="1.2"
                      strokeDasharray="6 6"
                      strokeOpacity={0.7}
                      fill="none"
                    />
                    {/* Etched Runes & Cross Marks */}
                    <Path
                      d="M 120,8 L 120,24 M 120,216 L 120,232 M 8,120 L 24,120 M 216,120 L 232,120"
                      stroke="#E9D5FF"
                      strokeWidth="2"
                      strokeOpacity={0.9}
                    />
                    <Path
                      d="M 40,40 L 52,52 M 200,40 L 188,52 M 40,200 L 52,188 M 200,200 L 188,188"
                      stroke="#C084FC"
                      strokeWidth="1.5"
                      strokeOpacity={0.8}
                    />
                  </Svg>
                </Animated.View>

                {/* Inner Rune Ring */}
                <Animated.View style={[styles.innerRuneRing, innerRingAnimStyle]}>
                  <Svg width={160} height={160} viewBox="0 0 160 160">
                    <Circle
                      cx="80"
                      cy="80"
                      r="74"
                      stroke="#D8B4FE"
                      strokeWidth="1.5"
                      strokeDasharray="8 6"
                      strokeOpacity={0.9}
                      fill="none"
                    />
                    {/* Geometric Magic Pentagram/Hexagram Lines */}
                    <Path
                      d="M 80,14 L 140,118 L 20,118 Z"
                      stroke="#A855F7"
                      strokeWidth="1.2"
                      strokeOpacity={0.65}
                      fill="none"
                    />
                    <Path
                      d="M 80,146 L 20,42 L 140,42 Z"
                      stroke="#C084FC"
                      strokeWidth="1.2"
                      strokeOpacity={0.65}
                      fill="none"
                    />
                    <Circle
                      cx="80"
                      cy="80"
                      r="40"
                      stroke="#E9D5FF"
                      strokeWidth="1.8"
                      strokeOpacity={0.9}
                      fill="none"
                    />
                  </Svg>
                </Animated.View>

                {/* Ground Shadow underneath the Dragon Egg */}
                <Animated.View style={[styles.eggGroundShadow, eggShadowStyle]} />
              </View>
            </Pressable>

            {/* FLOATING DRAGON EGG CENTERPIECE */}
            <Animated.View
              style={[styles.floatingDragonEggContainer, eggFloatingStyle]}
              pointerEvents="none"
            >
              {/* Pulsing Ethereal Purple Aura Glow */}
              <Animated.View style={[styles.eggAuraGlow, eggAuraStyle]} />

              {/* High Definition Dragon Egg Image */}
              <Image
                source={require('@/assets/images/dragon_egg.jpg')}
                style={styles.dragonEggImage}
                contentFit="contain"
                transition={200}
              />
            </Animated.View>
          </View>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090610',
    position: 'relative',
  },

  /* Brazier Light Overlays */
  leftBrazierGlow: {
    position: 'absolute',
    left: -20,
    bottom: SCREEN_HEIGHT * 0.26,
    width: 140,
    height: 140,
    borderRadius: 70,
    zIndex: 2,
  },
  rightBrazierGlow: {
    position: 'absolute',
    right: -20,
    bottom: SCREEN_HEIGHT * 0.26,
    width: 140,
    height: 140,
    borderRadius: 70,
    zIndex: 2,
  },

  /* Rising Particles */
  particleLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 3,
  },
  emberParticle: {
    position: 'absolute',
    elevation: 6,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
  },

  /* Top Navigation */
  topBar: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 20,
  },
  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(20, 15, 35, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(192, 132, 252, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
  },

  /* Center Altar Area */
  altarZone: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.53,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  manaPillarContainer: {
    position: 'absolute',
    bottom: 20,
    width: SCREEN_WIDTH * 0.65,
    height: SCREEN_HEIGHT * 0.5,
    borderRadius: 80,
    zIndex: 4,
  },
  altarCircleInteractiveArea: {
    width: 250,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ scaleY: 0.52 }], // Perspective slant matching the 3D stone dais
  },
  altarBloom: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(168, 85, 247, 0.35)',
    shadowColor: '#C084FC',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 12,
  },
  shockwaveRing: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 3,
    borderColor: '#F5D0FE',
    backgroundColor: 'rgba(216, 180, 254, 0.15)',
    zIndex: 8,
  },
  magicCirclesWrapper: {
    width: 240,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRuneRing: {
    position: 'absolute',
    width: 240,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerRuneRing: {
    position: 'absolute',
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eggGroundShadow: {
    width: 90,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(10, 5, 20, 0.8)',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 16,
  },

  /* Floating Dragon Egg Centerpiece */
  floatingDragonEggContainer: {
    position: 'absolute',
    bottom: 50, // Hovering directly above the altar dais
    width: 200,
    height: 230,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 15,
  },
  eggAuraGlow: {
    position: 'absolute',
    width: 170,
    height: 200,
    borderRadius: 85,
    backgroundColor: 'rgba(168, 85, 247, 0.45)',
    shadowColor: '#C084FC',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 35,
    elevation: 16,
  },
  dragonEggImage: {
    width: '100%',
    height: '100%',
  },
});
