import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { Screen } from '@/components/common/Screen';
import { fontFamilies } from '@/theme/typography';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;

export interface HunterBadge {
  id: string;
  title: string;
  levelText: string;
  statText: string;
  imageSource: any;
  gradientColors: [string, string, string];
  mainColor: string;
}

export interface StreakTrophy {
  id: string;
  title: string;
  streakDays: number;
  isUnlocked: boolean;
  unlockedDate?: string;
  iconName: keyof typeof Ionicons.glyphMap;
}

const HUNTER_BADGES: HunterBadge[] = [
  {
    id: 'speed_strike',
    title: 'SPEED STRIKE',
    levelText: 'LVL 10',
    statText: 'MAX SPEED',
    imageSource: require('@/assets/images/goku.jpg'),
    gradientColors: ['#0284C7', '#38BDF8', '#7DD3FC'],
    mainColor: '#38BDF8',
  },
  {
    id: 'titan_force',
    title: 'TITAN FORCE',
    levelText: 'LVL 18',
    statText: 'POWER RATING 5000',
    imageSource: require('@/assets/images/naruto.jpg'),
    gradientColors: ['#1D4ED8', '#60A5FA', '#93C5FD'],
    mainColor: '#60A5FA',
  },
  {
    id: 'phoenix_heart',
    title: 'PHOENIX HEART',
    levelText: 'LVL 12',
    statText: 'REVIVE MASTER',
    imageSource: require('@/assets/images/itachi.jpg'),
    gradientColors: ['#B91C1C', '#EF4444', '#FCA5A5'],
    mainColor: '#EF4444',
  },
  {
    id: 'stealth_shadow',
    title: 'STEALTH SHADOW',
    levelText: 'LVL 9',
    statText: 'NIGHT OPS',
    imageSource: require('@/assets/images/jinwoo.jpg'),
    gradientColors: ['#6D28D9', '#A855F7', '#E9D5FF'],
    mainColor: '#A855F7',
  },
  {
    id: 'vanguard_shield',
    title: 'VANGUARD SHIELD',
    levelText: 'LVL 14',
    statText: 'DEFENSE 3800',
    imageSource: require('@/assets/images/gojo.jpg'),
    gradientColors: ['#B45309', '#F59E0B', '#FDE68A'],
    mainColor: '#F59E0B',
  },
  {
    id: 'viper_strike',
    title: 'VIPER STRIKE',
    levelText: 'LVL 11',
    statText: 'CRITICAL HIT',
    imageSource: require('@/assets/images/luffy.jpg'),
    gradientColors: ['#047857', '#10B981', '#6EE7B7'],
    mainColor: '#10B981',
  },
];

const STREAK_TROPHIES: StreakTrophy[] = [
  {
    id: '7_day',
    title: '7-Day Streak',
    streakDays: 7,
    isUnlocked: true,
    unlockedDate: '08/13/26',
    iconName: 'shield',
  },
  {
    id: '14_day',
    title: '14-Day Streak',
    streakDays: 14,
    isUnlocked: false,
    iconName: 'paw',
  },
  {
    id: '33_day',
    title: '33-Day Streak',
    streakDays: 33,
    isUnlocked: false,
    iconName: 'ribbon',
  },
  {
    id: '66_day',
    title: '66-Day Streak',
    streakDays: 66,
    isUnlocked: false,
    iconName: 'bonfire',
  },
  {
    id: '96_day',
    title: '96-Day Streak',
    streakDays: 96,
    isUnlocked: false,
    iconName: 'star',
  },
  {
    id: '132_day',
    title: '132-Day Streak',
    streakDays: 132,
    isUnlocked: false,
    iconName: 'trophy',
  },
];

export default function AchievementsScreen() {
  const [activeTab, setActiveTab] = useState<'badges' | 'streaks'>('badges');

  return (
    <Screen style={styles.container}>
      {/* Top Header */}
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>ACHIEVEMENTS</Text>
      </View>

      {/* Segmented Tab Switcher */}
      <View style={styles.tabBarContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'badges' && styles.tabButtonActive]}
          onPress={() => setActiveTab('badges')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === 'badges' && styles.tabTextActive]}>
            🔥 HUNTER BADGES
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'streaks' && styles.tabButtonActive]}
          onPress={() => setActiveTab('streaks')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === 'streaks' && styles.tabTextActive]}>
            ⚡ STREAK TROPHIES
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'badges' ? (
          /* TAB 1: HUNTER BADGES GRID (WITH REAL ARTWORK IMAGES) */
          <View style={styles.gridContainer}>
            {HUNTER_BADGES.map((badge) => (
              <View key={badge.id} style={styles.badgeCard}>
                {/* 3D Metallic Gradient Emblem Frame with Real Image */}
                <LinearGradient
                  colors={badge.gradientColors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.emblemOuterRing}
                >
                  <View style={styles.emblemInnerDarkCircle}>
                    <Image
                      source={badge.imageSource}
                      style={styles.emblemImage}
                      resizeMode="cover"
                    />
                  </View>
                </LinearGradient>

                {/* Badge Title */}
                <Text style={styles.badgeTitle}>{badge.title}</Text>

                {/* Level & Stat Pill Tag */}
                <View style={styles.badgePillTag}>
                  <Text style={styles.badgePillText}>
                    {badge.levelText} <Text style={{ color: '#52525B' }}>|</Text> {badge.statText}
                  </Text>
                </View>

                {/* HunterX Subtitle Tag */}
                <View style={styles.hunterBrandTag}>
                  <Text style={styles.hunterBrandText}>HUNTERX</Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          /* TAB 2: STREAK TROPHIES GRID (MATCHING SAMPLE SCREENSHOT 2) */
          <View style={styles.streaksContainer}>
            {/* Top Subtitle Prompt */}
            <Text style={styles.streakPromptText}>
              To secure a streak, complete <Text style={styles.streakPromptBold}>at least 2 tasks</Text> in a day.
            </Text>

            {/* Trophies Grid */}
            <View style={styles.gridContainer}>
              {STREAK_TROPHIES.map((trophy) => (
                <View key={trophy.id} style={styles.streakCard}>
                  {/* Streak Emblem Icon */}
                  <View
                    style={[
                      styles.streakEmblemCircle,
                      trophy.isUnlocked ? styles.streakEmblemUnlocked : styles.streakEmblemLocked,
                    ]}
                  >
                    <Ionicons
                      name={trophy.iconName}
                      size={32}
                      color={trophy.isUnlocked ? '#F97316' : '#52525B'}
                    />
                    <Text
                      style={[
                        styles.streakBadgeTag,
                        trophy.isUnlocked ? styles.streakBadgeTagUnlocked : styles.streakBadgeTagLocked,
                      ]}
                    >
                      {trophy.streakDays}-DAY
                    </Text>
                  </View>

                  {/* Trophy Title */}
                  <Text
                    style={[
                      styles.streakTitle,
                      trophy.isUnlocked ? styles.streakTitleUnlocked : styles.streakTitleLocked,
                    ]}
                  >
                    {trophy.title}
                  </Text>

                  {/* Unlocked Date */}
                  {trophy.isUnlocked && (
                    <Text style={styles.streakUnlockedDate}>{trophy.unlockedDate}</Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0C0E',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  headerBar: {
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1E1E24',
    marginBottom: 14,
  },
  headerTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: '#141418',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#242428',
    padding: 4,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#222228',
    borderWidth: 1,
    borderColor: '#F97316',
  },
  tabText: {
    fontFamily: fontFamilies.bold,
    fontSize: 12,
    fontWeight: '800',
    color: '#71717A',
  },
  tabTextActive: {
    color: '#F97316',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },

  /* TAB 1: HUNTER BADGES STYLES */
  badgeCard: {
    width: CARD_WIDTH,
    backgroundColor: '#121215',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#242428',
    padding: 16,
    alignItems: 'center',
    gap: 10,
  },
  emblemOuterRing: {
    width: 76,
    height: 76,
    borderRadius: 38,
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  emblemInnerDarkCircle: {
    width: '100%',
    height: '100%',
    borderRadius: 35,
    overflow: 'hidden',
    backgroundColor: '#101014',
  },
  emblemImage: {
    width: '100%',
    height: '100%',
  },
  badgeTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  badgePillTag: {
    backgroundColor: '#1A1A20',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2E2E36',
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
  },
  badgePillText: {
    fontFamily: fontFamilies.bold,
    fontSize: 10,
    fontWeight: '800',
    color: '#A1A1AA',
    letterSpacing: 0.5,
  },
  hunterBrandTag: {
    backgroundColor: '#16161A',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#27272A',
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  hunterBrandText: {
    fontFamily: fontFamilies.bold,
    fontSize: 9,
    fontWeight: '800',
    color: '#F97316',
    letterSpacing: 1.5,
  },

  /* TAB 2: STREAK TROPHIES STYLES */
  streaksContainer: {
    gap: 16,
  },
  streakPromptText: {
    fontFamily: fontFamilies.regular,
    fontSize: 14,
    color: '#D4D4D8',
    textAlign: 'center',
    lineHeight: 20,
    marginVertical: 8,
  },
  streakPromptBold: {
    fontFamily: fontFamilies.bold,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  streakCard: {
    width: CARD_WIDTH,
    backgroundColor: '#101013',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1E1E24',
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  streakEmblemCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  streakEmblemUnlocked: {
    backgroundColor: 'rgba(249, 115, 22, 0.12)',
    borderWidth: 1.5,
    borderColor: '#F97316',
  },
  streakEmblemLocked: {
    backgroundColor: '#16161A',
    borderWidth: 1.5,
    borderColor: '#2E2E36',
  },
  streakBadgeTag: {
    position: 'absolute',
    bottom: -6,
    fontFamily: fontFamilies.bold,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.5,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
  },
  streakBadgeTagUnlocked: {
    backgroundColor: '#F97316',
    color: '#FFFFFF',
  },
  streakBadgeTagLocked: {
    backgroundColor: '#27272A',
    color: '#71717A',
  },
  streakTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 4,
  },
  streakTitleUnlocked: {
    color: '#F97316',
  },
  streakTitleLocked: {
    color: '#71717A',
  },
  streakUnlockedDate: {
    fontFamily: fontFamilies.regular,
    fontSize: 11,
    color: '#71717A',
  },
});
