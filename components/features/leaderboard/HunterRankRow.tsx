import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { fontFamilies } from '@/theme/typography';
import { AVATAR_THUMB_WIDTH, DEFAULT_BLURHASH, optimizeCloudinaryUrl } from '@/services/media/cloudinary';

export interface LeaderboardHunterItem {
  id: string;
  rank: number;
  displayName: string;
  title: string;
  avatarUrl: string;
  level: number;
  xp: number;
  streakDays: number;
  divisionTier: 'S-RANK' | 'A-RANK' | 'B-RANK' | 'C-RANK';
  isCurrentUser?: boolean;
}

interface HunterRankRowProps {
  hunter: LeaderboardHunterItem;
  onPress?: (hunter: LeaderboardHunterItem) => void;
}

export const HunterRankRow: React.FC<HunterRankRowProps> = ({
  hunter,
  onPress,
}) => {
  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'S-RANK':
        return '#F59E0B';
      case 'A-RANK':
        return '#A855F7';
      case 'B-RANK':
        return '#3B82F6';
      default:
        return '#71717A';
    }
  };

  const formatXP = (xpNum: number) => {
    return xpNum >= 1000 ? `${(xpNum / 1000).toFixed(1)}k` : `${xpNum}`;
  };

  const tierColor = getTierColor(hunter.divisionTier);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress?.(hunter)}
      style={[
        styles.rowContainer,
        hunter.isCurrentUser && styles.currentUserRowHighlight,
      ]}
    >
      {/* Rank Number Badge */}
      <View style={styles.rankNumCol}>
        <Text
          style={[
            styles.rankNumText,
            hunter.rank <= 10 && { color: '#F59E0B' },
          ]}
        >
          #{hunter.rank}
        </Text>
      </View>

      {/* Avatar & Level Badge */}
      <View style={styles.avatarCol}>
        <Image
          source={{ uri: optimizeCloudinaryUrl(hunter.avatarUrl, AVATAR_THUMB_WIDTH) }}
          style={styles.avatarImage}
          contentFit="cover"
          cachePolicy="memory-disk"
          placeholder={{ blurhash: DEFAULT_BLURHASH }}
          transition={150}
        />
        <View style={styles.levelBadgeMini}>
          <Text style={styles.levelBadgeMiniText}>{hunter.level}</Text>
        </View>
      </View>

      {/* Hunter Details & Title */}
      <View style={styles.hunterInfoCol}>
        <View style={styles.nameTitleRow}>
          <Text style={styles.hunterDisplayName} numberOfLines={1}>
            {hunter.displayName}
          </Text>
          {hunter.isCurrentUser && (
            <View style={styles.youBadgeTag}>
              <Text style={styles.youBadgeText}>YOU</Text>
            </View>
          )}
        </View>

        <View style={styles.subMetaRow}>
          <View style={[styles.tierTagPill, { borderColor: tierColor }]}>
            <Text style={[styles.tierTagText, { color: tierColor }]}>
              {hunter.divisionTier}
            </Text>
          </View>
          <Text style={styles.hunterTitleText} numberOfLines={1}>
            {hunter.title}
          </Text>
        </View>
      </View>

      {/* Streak & XP Stats */}
      <View style={styles.statsCol}>
        <Text style={styles.xpValueText}>{formatXP(hunter.xp)} XP</Text>
        <View style={styles.streakBadgeRow}>
          <Text style={styles.streakIcon}>🔥</Text>
          <Text style={styles.streakDaysText}>{hunter.streakDays}d</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141418',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#242428',
  },
  currentUserRowHighlight: {
    backgroundColor: '#1E1B12',
    borderColor: '#F59E0B',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  rankNumCol: {
    width: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankNumText: {
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '900',
  },
  avatarCol: {
    position: 'relative',
    marginRight: 12,
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#27272A',
  },
  levelBadgeMini: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#09090B',
  },
  levelBadgeMiniText: {
    fontFamily: fontFamilies.bold,
    fontSize: 9,
    color: '#09090B',
    fontWeight: '900',
  },
  hunterInfoCol: {
    flex: 1,
    justifyContent: 'center',
  },
  nameTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hunterDisplayName: {
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '800',
    maxWidth: 130,
  },
  youBadgeTag: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  youBadgeText: {
    fontFamily: fontFamilies.bold,
    fontSize: 8,
    color: '#09090B',
    fontWeight: '900',
  },
  subMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
  },
  tierTagPill: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    borderWidth: 1,
  },
  tierTagText: {
    fontFamily: fontFamilies.bold,
    fontSize: 8,
    fontWeight: '900',
  },
  hunterTitleText: {
    fontFamily: fontFamilies.medium,
    fontSize: 11,
    color: '#9CA3AF',
    flex: 1,
  },
  statsCol: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  xpValueText: {
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    color: '#F59E0B',
    fontWeight: '900',
  },
  streakBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 2,
  },
  streakIcon: {
    fontSize: 10,
  },
  streakDaysText: {
    fontFamily: fontFamilies.bold,
    fontSize: 10,
    color: '#71717A',
    fontWeight: '700',
  },
});
