import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { fontFamilies } from '@/theme/typography';

export interface PodiumHunter {
  id: string;
  rank: 1 | 2 | 3;
  displayName: string;
  title: string;
  avatarUrl: string;
  level: number;
  xp: number;
  streakDays: number;
  isCurrentUser?: boolean;
}

interface MonarchPodiumProps {
  topThree: PodiumHunter[];
  onSelectHunter?: (hunter: PodiumHunter) => void;
}

export const MonarchPodium: React.FC<MonarchPodiumProps> = ({
  topThree,
  onSelectHunter,
}) => {
  const crownGlow = useSharedValue(1);

  React.useEffect(() => {
    crownGlow.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1200 }),
        withTiming(1, { duration: 1200 })
      ),
      -1,
      true
    );
  }, []);

  const animatedCrownStyle = useAnimatedStyle(() => ({
    transform: [{ scale: crownGlow.value }],
  }));

  const rank1 = topThree.find((h) => h.rank === 1);
  const rank2 = topThree.find((h) => h.rank === 2);
  const rank3 = topThree.find((h) => h.rank === 3);

  const formatXP = (xpNum: number) => {
    return xpNum >= 1000 ? `${(xpNum / 1000).toFixed(1)}k` : `${xpNum}`;
  };

  return (
    <View style={styles.podiumStageContainer}>
      {/* Background Stage Aura Glow */}
      <View style={styles.stageBacklightGlow} />

      <View style={styles.podiumRow}>
        {/* RANK 2: SILVER VANGUARD (LEFT) */}
        {rank2 && (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => onSelectHunter?.(rank2)}
            style={[styles.podiumSlot, styles.podiumSlot2]}
          >
            {/* Avatar & Crown */}
            <View style={styles.avatarWrapper}>
              <View style={[styles.avatarFrameBorder, styles.borderSilver]}>
                <Image source={{ uri: rank2.avatarUrl }} style={styles.avatarImage} />
              </View>
              <View style={[styles.rankBadgeCapsule, styles.bgSilver]}>
                <Text style={styles.rankBadgeText}>#2</Text>
              </View>
            </View>

            <Text style={styles.hunterName} numberOfLines={1}>
              {rank2.displayName}
            </Text>

            <View style={styles.levelCapsule}>
              <Text style={styles.levelCapsuleText}>LVL {rank2.level}</Text>
            </View>

            {/* Podium Base Pillar */}
            <LinearGradient
              colors={['#27272A', '#18181B', '#09090B']}
              style={[styles.podiumPillar, styles.pillar2]}
            >
              <View style={styles.pillarBorderTopSilver} />
              <FontAwesome5 name="shield-alt" size={16} color="#A1A1AA" />
              <Text style={styles.xpText}>{formatXP(rank2.xp)} EXP</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* RANK 1: GOLD MONARCH (CENTER ELEVATED) */}
        {rank1 && (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => onSelectHunter?.(rank1)}
            style={[styles.podiumSlot, styles.podiumSlot1]}
          >
            {/* Crown Header */}
            <Animated.View style={[styles.crownWrapper, animatedCrownStyle]}>
              <MaterialCommunityIcons name="crown" size={32} color="#F59E0B" />
            </Animated.View>

            {/* Avatar & Crown */}
            <View style={styles.avatarWrapper1}>
              <View style={[styles.avatarFrameBorder, styles.borderGold]}>
                <Image source={{ uri: rank1.avatarUrl }} style={styles.avatarImage1} />
              </View>
              <View style={[styles.rankBadgeCapsule, styles.bgGold]}>
                <Text style={styles.rankBadgeText1}>#1</Text>
              </View>
            </View>

            <Text style={[styles.hunterName, styles.hunterName1]} numberOfLines={1}>
              {rank1.displayName}
            </Text>

            <View style={[styles.levelCapsule, styles.levelCapsuleGold]}>
              <Ionicons name="sparkles" size={10} color="#F59E0B" />
              <Text style={[styles.levelCapsuleText, styles.levelTextGold]}>
                LVL {rank1.level}
              </Text>
            </View>

            {/* Podium Base Pillar */}
            <LinearGradient
              colors={['#451A03', '#1F1912', '#0D0A06']}
              style={[styles.podiumPillar, styles.pillar1]}
            >
              <View style={styles.pillarBorderTopGold} />
              <FontAwesome5 name="crown" size={18} color="#F59E0B" />
              <Text style={[styles.xpText, styles.xpTextGold]}>{formatXP(rank1.xp)} EXP</Text>
              <Text style={styles.monarchTitleTag}>MONARCH</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* RANK 3: BRONZE SHADOW (RIGHT) */}
        {rank3 && (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => onSelectHunter?.(rank3)}
            style={[styles.podiumSlot, styles.podiumSlot3]}
          >
            {/* Avatar & Crown */}
            <View style={styles.avatarWrapper}>
              <View style={[styles.avatarFrameBorder, styles.borderBronze]}>
                <Image source={{ uri: rank3.avatarUrl }} style={styles.avatarImage} />
              </View>
              <View style={[styles.rankBadgeCapsule, styles.bgBronze]}>
                <Text style={styles.rankBadgeText}>#3</Text>
              </View>
            </View>

            <Text style={styles.hunterName} numberOfLines={1}>
              {rank3.displayName}
            </Text>

            <View style={styles.levelCapsule}>
              <Text style={styles.levelCapsuleText}>LVL {rank3.level}</Text>
            </View>

            {/* Podium Base Pillar */}
            <LinearGradient
              colors={['#27272A', '#18181B', '#09090B']}
              style={[styles.podiumPillar, styles.pillar3]}
            >
              <View style={styles.pillarBorderTopBronze} />
              <FontAwesome5 name="medal" size={16} color="#B45309" />
              <Text style={styles.xpText}>{formatXP(rank3.xp)} EXP</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  podiumStageContainer: {
    width: '100%',
    marginVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  stageBacklightGlow: {
    position: 'absolute',
    top: 20,
    width: 260,
    height: 140,
    borderRadius: 130,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    filter: 'blur(20px)',
  },
  podiumRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 8,
    gap: 10,
  },
  podiumSlot: {
    flex: 1,
    alignItems: 'center',
  },
  podiumSlot1: {
    zIndex: 10,
    marginBottom: 0,
  },
  podiumSlot2: {
    zIndex: 5,
    marginBottom: 0,
  },
  podiumSlot3: {
    zIndex: 5,
    marginBottom: 0,
  },

  /* Crown */
  crownWrapper: {
    marginBottom: 2,
  },

  /* Avatar Frames */
  avatarWrapper: {
    position: 'relative',
    marginBottom: 6,
  },
  avatarWrapper1: {
    position: 'relative',
    marginBottom: 6,
  },
  avatarFrameBorder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    padding: 2.5,
    backgroundColor: '#18181B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  borderGold: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2.5,
    borderColor: '#F59E0B',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  borderSilver: {
    borderWidth: 2,
    borderColor: '#E4E4E7',
  },
  borderBronze: {
    borderWidth: 2,
    borderColor: '#D97706',
  },
  avatarImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  avatarImage1: {
    width: 68,
    height: 68,
    borderRadius: 34,
  },

  /* Rank Badge Capsule */
  rankBadgeCapsule: {
    position: 'absolute',
    bottom: -4,
    alignSelf: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#09090B',
  },
  bgGold: {
    backgroundColor: '#F59E0B',
  },
  bgSilver: {
    backgroundColor: '#E4E4E7',
  },
  bgBronze: {
    backgroundColor: '#D97706',
  },
  rankBadgeText: {
    fontFamily: fontFamilies.bold,
    fontSize: 10,
    color: '#09090B',
    fontWeight: '900',
  },
  rankBadgeText1: {
    fontFamily: fontFamilies.bold,
    fontSize: 11,
    color: '#09090B',
    fontWeight: '900',
  },

  /* Hunter Names & Titles */
  hunterName: {
    fontFamily: fontFamilies.bold,
    fontSize: 12,
    color: '#E4E4E7',
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 4,
  },
  hunterName1: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '900',
  },
  levelCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#18181B',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  levelCapsuleGold: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderColor: 'rgba(245, 158, 11, 0.4)',
  },
  levelCapsuleText: {
    fontFamily: fontFamilies.bold,
    fontSize: 10,
    color: '#A1A1AA',
    fontWeight: '700',
  },
  levelTextGold: {
    color: '#F59E0B',
  },

  /* Base Pillars */
  podiumPillar: {
    width: '100%',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#27272A',
    gap: 4,
  },
  pillar1: {
    height: 120,
    borderColor: 'rgba(245, 158, 11, 0.4)',
  },
  pillar2: {
    height: 95,
  },
  pillar3: {
    height: 80,
  },
  pillarBorderTopGold: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#F59E0B',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  pillarBorderTopSilver: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#E4E4E7',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  pillarBorderTopBronze: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#D97706',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  xpText: {
    fontFamily: fontFamilies.bold,
    fontSize: 12,
    color: '#D4D4D8',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  xpTextGold: {
    color: '#F59E0B',
    fontSize: 13,
  },
  monarchTitleTag: {
    fontFamily: fontFamilies.bold,
    fontSize: 9,
    color: '#F59E0B',
    fontWeight: '900',
    letterSpacing: 1.5,
    marginTop: 2,
  },
});
