import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Modal,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Defs, LinearGradient as SvgGradient, Polygon, Stop } from 'react-native-svg';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

import { useAuthStore } from '@/store/useAuthStore';
import { colors, palette } from '@/theme/colors';
import { fontFamilies } from '@/theme/typography';

interface LevelUpRewardModalProps {
  visible: boolean;
  onClose: () => void;
  onClaim?: () => void;
  level?: number;
}

// Matching Onboarding Primary Accent Color (Cyber Gold / Onboarding Gold)
const ACCENT_COLOR = '#E5A93C';

export const LevelUpRewardModal: React.FC<LevelUpRewardModalProps> = ({
  visible,
  onClose,
  onClaim,
  level: propsLevel,
}) => {
  const user = useAuthStore((state) => state.user);
  const currentLevel = propsLevel ?? user?.level ?? 12;

  // Pulsing glow animation refs
  const glowAnim = useRef(new Animated.Value(0.45)).current;
  const scaleAnim = useRef(new Animated.Value(1.0)).current;

  useEffect(() => {
    if (visible) {
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(glowAnim, {
              toValue: 0.95,
              duration: 1800,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: false,
            }),
            Animated.timing(glowAnim, {
              toValue: 0.45,
              duration: 1800,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: false,
            }),
          ]),
          Animated.sequence([
            Animated.timing(scaleAnim, {
              toValue: 1.12,
              duration: 1800,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: false,
            }),
            Animated.timing(scaleAnim, {
              toValue: 1.0,
              duration: 1800,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: false,
            }),
          ]),
        ])
      ).start();
    }
  }, [visible, glowAnim, scaleAnim]);

  const handleClaim = () => {
    if (onClaim) {
      onClaim();
    }
    onClose();
  };

  const handleSkip = () => {
    onClose();
    router.replace('/(tabs)');
  };

  const HEX_WIDTH = 260;
  const HEX_HEIGHT = 300;

  // Hexagon points
  const hexPoints = `${HEX_WIDTH / 2},2 ${HEX_WIDTH - 2},${HEX_HEIGHT * 0.25} ${
    HEX_WIDTH - 2
  },${HEX_HEIGHT * 0.75} ${HEX_WIDTH / 2},${HEX_HEIGHT - 2} 2,${
    HEX_HEIGHT * 0.75
  } 2,${HEX_HEIGHT * 0.25}`;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={false}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <SafeAreaView style={styles.container}>
        {/* Full-Screen Ambient Glow */}
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            {
              opacity: glowAnim,
            },
          ]}
        >
          <LinearGradient
            colors={['rgba(229, 169, 60, 0.32)', 'rgba(229, 169, 60, 0.14)', 'rgba(10, 8, 2, 0.95)', '#000000']}
            locations={[0, 0.35, 0.75, 1.0]}
            start={{ x: 0.5, y: 0.0 }}
            end={{ x: 0.5, y: 1.0 }}
            style={StyleSheet.absoluteFillObject}
          />
        </Animated.View>

        <View style={styles.content}>
          {/* Header Section */}
          <View style={styles.header}>
            <Text style={styles.title}>LEVEL UP</Text>
            <Text style={styles.subtitle}>
              YOU'VE REACHED A NEW TIER IN THE ARISE ARENA.
            </Text>
          </View>

          {/* Hexagon Graphic Section with Pulsing Glow */}
          <View style={styles.hexagonSection}>
            {/* Soft Pulsing Glowing Aura Layer */}
            <Animated.View
              style={[
                styles.glowCircle,
                {
                  opacity: glowAnim,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            />

            {/* SVG Hexagon */}
            <View style={{ width: HEX_WIDTH, height: HEX_HEIGHT, justifyContent: 'center', alignItems: 'center' }}>
              <Svg width={HEX_WIDTH} height={HEX_HEIGHT} viewBox={`0 0 ${HEX_WIDTH} ${HEX_HEIGHT}`}>
                <Defs>
                  <SvgGradient id="hexBg" x1="0%" y1="0%" x2="0%" y2="100%">
                    <Stop offset="0%" stopColor="#2E2206" stopOpacity="0.95" />
                    <Stop offset="50%" stopColor="#1C1503" stopOpacity="0.9" />
                    <Stop offset="100%" stopColor="#0D0A02" stopOpacity="0.98" />
                  </SvgGradient>
                </Defs>
                <Polygon
                  points={hexPoints}
                  fill="url(#hexBg)"
                  stroke={ACCENT_COLOR}
                  strokeWidth="2.5"
                />
              </Svg>

              {/* Text Inside Hexagon */}
              <View style={styles.hexContent}>
                <Text style={styles.hexRankLabel}>CURRENT RANK</Text>
                <Text style={styles.hexLevelText}>LEVEL {currentLevel}</Text>
                <View style={styles.hexDivider} />
              </View>
            </View>
          </View>

          {/* Bottom Actions */}
          <View style={styles.actionSection}>
            <Animated.View style={[{ width: '100%' }, { shadowOpacity: glowAnim }]}>
              <TouchableOpacity
                style={styles.claimButton}
                activeOpacity={0.85}
                onPress={handleClaim}
              >
                <Text style={styles.claimButtonText}>CLAIM YOUR LOOT</Text>
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity
              style={styles.skipButton}
              activeOpacity={0.7}
              onPress={handleSkip}
            >
              <Text style={styles.skipButtonText}>SKIP TO DASHBOARD</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 70,
    paddingBottom: 36,
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 2,
  },

  /* Header */
  header: {
    alignItems: 'center',
    marginTop: 24,
  },
  title: {
    fontFamily: fontFamilies.bold,
    fontSize: 28,
    color: ACCENT_COLOR,
    letterSpacing: 2,
    textAlign: 'center',
    textShadowColor: 'rgba(229, 169, 60, 0.65)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 14,
  },
  subtitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 10,
    color: '#8E8E93',
    letterSpacing: 1.5,
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
    lineHeight: 16,
  },

  /* Hexagon Section */
  hexagonSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    position: 'relative',
  },
  glowCircle: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(229, 169, 60, 0.22)',
    shadowColor: ACCENT_COLOR,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 60,
    shadowOpacity: 0.95,
    elevation: 20,
  },
  hexContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hexRankLabel: {
    fontFamily: fontFamilies.bold,
    fontSize: 11,
    color: '#8E8E93',
    letterSpacing: 2,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  hexLevelText: {
    fontFamily: fontFamilies.bold,
    fontSize: 32,
    color: ACCENT_COLOR,
    letterSpacing: 1.5,
    textShadowColor: 'rgba(229, 169, 60, 0.55)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  hexDivider: {
    width: 70,
    height: 2,
    backgroundColor: 'rgba(229, 169, 60, 0.35)',
    marginTop: 8,
    borderRadius: 1,
  },

  /* Action Section */
  actionSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  claimButton: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 16,
    elevation: 10,
  },
  claimButtonText: {
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    color: '#000000',
    letterSpacing: 1.5,
  },
  skipButton: {
    paddingVertical: 14,
    marginTop: 6,
  },
  skipButtonText: {
    fontFamily: fontFamilies.bold,
    fontSize: 11,
    color: '#8E8E93',
    letterSpacing: 1.5,
  },
});
