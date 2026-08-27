import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useRouter } from 'expo-router';
import { Screen } from '@/components/common/Screen';
import { fontFamilies } from '@/theme/typography';
import { CLOUDINARY_ASSETS } from '@/constants/cloudinaryAssets';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 52) / 2;

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
  progress?: string;
  iconName: keyof typeof Ionicons.glyphMap;
}

const HUNTER_BADGES: HunterBadge[] = [
  {
    id: 'speed_strike',
    title: 'SPEED STRIKE',
    levelText: 'LVL 10',
    statText: 'MAX SPEED',
    imageSource: CLOUDINARY_ASSETS.badge_speed_strike,
    gradientColors: ['#0284C7', '#38BDF8', '#7DD3FC'],
    mainColor: '#38BDF8',
  },
  {
    id: 'titan_force',
    title: 'TITAN FORCE',
    levelText: 'LVL 18',
    statText: 'POWER RATING 5000',
    imageSource: CLOUDINARY_ASSETS.badge_titan_force,
    gradientColors: ['#1D4ED8', '#60A5FA', '#93C5FD'],
    mainColor: '#60A5FA',
  },
  {
    id: 'phoenix_heart',
    title: 'PHOENIX HEART',
    levelText: 'LVL 12',
    statText: 'REVIVE MASTER',
    imageSource: CLOUDINARY_ASSETS.badge_phoenix_heart,
    gradientColors: ['#B91C1C', '#EF4444', '#FCA5A5'],
    mainColor: '#EF4444',
  },
  {
    id: 'stealth_shadow',
    title: 'STEALTH SHADOW',
    levelText: 'LVL 9',
    statText: 'NIGHT OPS',
    imageSource: CLOUDINARY_ASSETS.badge_stealth_shadow,
    gradientColors: ['#6D28D9', '#A855F7', '#E9D5FF'],
    mainColor: '#A855F7',
  },
  {
    id: 'vanguard_shield',
    title: 'VANGUARD SHIELD',
    levelText: 'LVL 14',
    statText: 'DEFENSE 3800',
    imageSource: CLOUDINARY_ASSETS.badge_vanguard_shield,
    gradientColors: ['#B45309', '#F59E0B', '#FDE68A'],
    mainColor: '#F59E0B',
  },
  {
    id: 'viper_strike',
    title: 'VIPER STRIKE',
    levelText: 'LVL 11',
    statText: 'CRITICAL HIT',
    imageSource: CLOUDINARY_ASSETS.badge_viper_strike,
    gradientColors: ['#047857', '#10B981', '#6EE7B7'],
    mainColor: '#10B981',
  },
  {
    id: 'solo_monarch',
    title: 'SOLO MONARCH',
    levelText: 'LVL 20',
    statText: 'SHADOW COMMANDER',
    imageSource: CLOUDINARY_ASSETS.badge_solo_monarch,
    gradientColors: ['#581C87', '#9333EA', '#C084FC'],
    mainColor: '#9333EA',
  },
  {
    id: 'cursed_bound',
    title: 'CURSED BOUND',
    levelText: 'LVL 15',
    statText: 'DOMAIN EXPANSION',
    imageSource: CLOUDINARY_ASSETS.badge_cursed_bound,
    gradientColors: ['#991B1B', '#DC2626', '#FCA5A5'],
    mainColor: '#DC2626',
  },
  {
    id: 'dragon_soul',
    title: 'DRAGON SOUL',
    levelText: 'LVL 25',
    statText: 'OVER 9000 XP',
    imageSource: CLOUDINARY_ASSETS.badge_dragon_soul,
    gradientColors: ['#C2410C', '#EA580C', '#FDBA74'],
    mainColor: '#EA580C',
  },
  {
    id: 'streak_guardian',
    title: 'STREAK GUARDIAN',
    levelText: 'LVL 30',
    statText: 'UNBROKEN CHAIN',
    imageSource: CLOUDINARY_ASSETS.badge_streak_guardian,
    gradientColors: ['#D97706', '#F59E0B', '#FDE68A'],
    mainColor: '#F59E0B',
  },
];

const STREAK_TROPHIES: StreakTrophy[] = [
  {
    id: '7_day',
    title: '7-Day Streak',
    streakDays: 7,
    isUnlocked: true,
    unlockedDate: '08/13/26',
    iconName: 'flame',
  },
  {
    id: '14_day',
    title: '14-Day Streak',
    streakDays: 14,
    isUnlocked: false,
    progress: '0/14',
    iconName: 'paw-outline',
  },
  {
    id: '33_day',
    title: '33-Day Streak',
    streakDays: 33,
    isUnlocked: false,
    iconName: 'shield-half-outline',
  },
  {
    id: '66_day',
    title: '66-Day Streak',
    streakDays: 66,
    isUnlocked: false,
    iconName: 'cut-outline',
  },
  {
    id: '96_day',
    title: '96-Day Streak',
    streakDays: 96,
    isUnlocked: false,
    iconName: 'sparkles-outline',
  },
  {
    id: '132_day',
    title: '132-Day Streak',
    streakDays: 132,
    isUnlocked: false,
    iconName: 'flash-outline',
  },
  {
    id: '256_day',
    title: '256-Day Streak',
    streakDays: 256,
    isUnlocked: false,
    iconName: 'shield-checkmark-outline',
  },
  {
    id: '365_day',
    title: '365-Day Streak',
    streakDays: 365,
    isUnlocked: false,
    iconName: 'trophy-outline',
  },
];

export default function AchievementsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'badges' | 'streaks'>('badges');

  const handleContactSupport = async () => {
    const email = 'support@hunterx.app';
    const subject = encodeURIComponent('Streak Loss Support Request');
    const body = encodeURIComponent('Hello HunterX Support Team,\n\nI need assistance regarding a streak loss on my account.\n\nThank you!');
    const url = `mailto:${email}?subject=${subject}&body=${body}`;

    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Contact Support', `Please email us at: ${email}`);
      }
    } catch {
      Alert.alert('Contact Support', `Please email us at: ${email}`);
    }
  };

  return (
    <Screen style={styles.container}>
      {/* Top Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.navBackButton}
          activeOpacity={0.7}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>ACHIEVEMENTS</Text>

        <View style={{ width: 24 }} />
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
          /* TAB 1: HUNTER BADGES GRID (10 HUNTER BADGES) */
          <View style={styles.gridContainer}>
            {HUNTER_BADGES.map((badge) => (
              <View key={badge.id} style={styles.badgeCard}>
                {/* 3D Metallic Gradient Emblem Frame */}
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

                {/* Level & Stat Text */}
                <Text style={styles.badgeSubText}>
                  {badge.levelText} • {badge.statText}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          /* TAB 2: STREAK TROPHIES GRID (CLEAN FLOATING ICON DESIGN) */
          <View style={styles.streaksContainer}>
            {/* Top Subtitle Prompt */}
            <Text style={styles.streakPromptText}>
              To secure a streak, complete <Text style={styles.streakPromptBold}>at least 2 tasks</Text> in a day.
            </Text>

            {/* Trophies Grid */}
            <View style={styles.gridContainer}>
              {STREAK_TROPHIES.map((trophy) => (
                <View key={trophy.id} style={styles.streakCard}>
                  {/* Clean Emblem Icon - NO circular or hexagonal background wrappers! */}
                  <View style={styles.streakIconWrapper}>
                    <Ionicons
                      name={trophy.iconName}
                      size={48}
                      color={trophy.isUnlocked ? '#F97316' : '#52525B'}
                    />
                    <View
                      style={[
                        styles.streakPillTag,
                        trophy.isUnlocked ? styles.streakPillTagUnlocked : styles.streakPillTagLocked,
                      ]}
                    >
                      <Text
                        style={[
                          styles.streakPillTagText,
                          trophy.isUnlocked ? styles.streakPillTagTextUnlocked : styles.streakPillTagTextLocked,
                        ]}
                      >
                        {trophy.streakDays}-DAY
                      </Text>
                    </View>
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

                  {/* Date or Progress Subtitle */}
                  {trophy.isUnlocked && trophy.unlockedDate ? (
                    <Text style={styles.streakUnlockedDate}>{trophy.unlockedDate}</Text>
                  ) : trophy.progress ? (
                    <Text style={styles.streakProgressDate}>{trophy.progress}</Text>
                  ) : null}
                </View>
              ))}
            </View>

            {/* Bottom Contact Support Section */}
            <View style={styles.contactSupportContainer}>
              <Text style={styles.contactSupportTitle}>Issues with streak loss?</Text>
              <TouchableOpacity
                style={styles.contactSupportBtn}
                activeOpacity={0.8}
                onPress={handleContactSupport}
              >
                <Ionicons name="mail-outline" size={18} color="#FFFFFF" />
                <Text style={styles.contactSupportBtnText}>Contact Support</Text>
              </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E1E24',
    marginBottom: 14,
  },
  navBackButton: {
    padding: 4,
    marginLeft: -4,
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
    rowGap: 24,
    columnGap: 16,
    justifyContent: 'space-between',
  },

  /* TAB 1: HUNTER BADGES STYLES */
  badgeCard: {
    width: CARD_WIDTH,
    alignItems: 'center',
    gap: 8,
    marginVertical: 4,
  },
  emblemOuterRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
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
    borderRadius: 37,
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
  badgeSubText: {
    fontFamily: fontFamilies.bold,
    fontSize: 10,
    fontWeight: '800',
    color: '#A1A1AA',
    letterSpacing: 0.5,
    textAlign: 'center',
  },

  /* TAB 2: STREAK TROPHIES STYLES (CLEAN FLOATING ICON DESIGN) */
  streaksContainer: {
    gap: 20,
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
    alignItems: 'center',
    gap: 6,
    marginVertical: 4,
  },
  streakIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 70,
    position: 'relative',
  },
  streakPillTag: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  streakPillTagUnlocked: {
    backgroundColor: 'rgba(249, 115, 22, 0.2)',
    borderWidth: 1,
    borderColor: '#F97316',
  },
  streakPillTagLocked: {
    backgroundColor: '#1C1C22',
    borderWidth: 1,
    borderColor: '#2A2A32',
  },
  streakPillTagText: {
    fontFamily: fontFamilies.bold,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  streakPillTagTextUnlocked: {
    color: '#F97316',
  },
  streakPillTagTextLocked: {
    color: '#71717A',
  },
  streakTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 2,
  },
  streakTitleUnlocked: {
    color: '#F97316',
  },
  streakTitleLocked: {
    color: '#FFFFFF',
  },
  streakUnlockedDate: {
    fontFamily: fontFamilies.regular,
    fontSize: 11,
    color: '#71717A',
  },
  streakProgressDate: {
    fontFamily: fontFamilies.regular,
    fontSize: 11,
    color: '#52525B',
  },

  /* BOTTOM CONTACT SUPPORT STYLES */
  contactSupportContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#18181C',
  },
  contactSupportTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  contactSupportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#27272A',
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#3F3F46',
  },
  contactSupportBtnText: {
    fontFamily: fontFamilies.bold,
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
