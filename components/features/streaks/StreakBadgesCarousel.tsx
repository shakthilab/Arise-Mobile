import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  LayoutChangeEvent,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { fontFamilies } from '@/theme/typography';
import * as Haptics from 'expo-haptics';

export interface StreakBadgeItem {
  id: number;
  dayNumber: number;
  daysText: string;
  title: string;
  imageSource: any;
}

export interface UserBadgeData {
  badge_id?: number;
  name?: string;
  description?: string;
  milestone_days?: number;
  earned_at?: string;
}

export const STREAK_BADGES_DATA: StreakBadgeItem[] = [
  {
    id: 1,
    dayNumber: 7,
    daysText: '7 days',
    title: 'Ember Vow',
    imageSource: require('@/assets/images/streak-badges/ember_vow.png'),
  },
  {
    id: 2,
    dayNumber: 14,
    daysText: '14 days',
    title: 'Iron Resolve',
    imageSource: require('@/assets/images/streak-badges/iron_resolve.png'),
  },
  {
    id: 3,
    dayNumber: 30,
    daysText: '30 days',
    title: 'Shadow Oath',
    imageSource: require('@/assets/images/streak-badges/shadow_oath.png'),
  },
  {
    id: 4,
    dayNumber: 60,
    daysText: '60 days',
    title: 'Phantom Discipline',
    imageSource: require('@/assets/images/streak-badges/phantom_discipline.png'),
  },
  {
    id: 5,
    dayNumber: 90,
    daysText: '90 days',
    title: 'Sovereign Will',
    imageSource: require('@/assets/images/streak-badges/sovereign_will.png'),
  },
  {
    id: 6,
    dayNumber: 200,
    daysText: '200 days',
    title: 'Void Ascendant',
    imageSource: require('@/assets/images/streak-badges/void_ascendant.png'),
  },
  {
    id: 7,
    dayNumber: 365,
    daysText: '365 days',
    title: 'Eternal Hunter',
    imageSource: require('@/assets/images/streak-badges/eternal_hunter.png'),
  },
];

interface StreakBadgesCarouselProps {
  currentStreak?: number; // Current user streak days
  userBadges?: UserBadgeData[]; // User's earned badges array from API
  onBadgePress?: (badge: StreakBadgeItem) => void;
}

export const StreakBadgesCarousel: React.FC<StreakBadgesCarouselProps> = ({
  currentStreak = 0,
  userBadges,
  onBadgePress,
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [measuredWidth, setMeasuredWidth] = useState<number>(0);
  const scrollViewRef = useRef<ScrollView>(null);

  // Dynamic width measurement for 100% precision across all mobile devices
  const availableWidth = measuredWidth > 0 ? measuredWidth : Math.max(280, windowWidth - 48);
  const cardGap = 6;
  const itemsPerPage = 4;
  const cardWidth = Math.floor((availableWidth - cardGap * (itemsPerPage - 1)) / itemsPerPage);

  // Total pages calculation (4 badges per page view)
  const totalPages = Math.ceil(STREAK_BADGES_DATA.length / itemsPerPage);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    if (width > 0 && Math.abs(width - measuredWidth) > 2) {
      setMeasuredWidth(width);
    }
  };

  const handleToggleCollapse = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setIsCollapsed((prev) => !prev);
  };

  const handlePressBadge = (badge: StreakBadgeItem) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    if (onBadgePress) {
      onBadgePress(badge);
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const pageLength = (cardWidth + cardGap) * itemsPerPage;
    if (pageLength > 0) {
      const pageIndex = Math.round(contentOffsetX / pageLength);
      const clampedPage = Math.min(totalPages - 1, Math.max(0, pageIndex));
      if (clampedPage !== activePageIndex) {
        setActivePageIndex(clampedPage);
      }
    }
  };

  return (
    <View style={styles.carouselContainer} onLayout={handleLayout}>
      {/* Top Header Row with Title and Collapse Chevron */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handleToggleCollapse}
        style={styles.headerRow}
      >
        <Text style={styles.headerTitle}>Badges</Text>
        <Ionicons
          name={isCollapsed ? 'chevron-down' : 'chevron-up'}
          size={18}
          color="#9CA3AF"
        />
      </TouchableOpacity>

      {/* Expandable Carousel Content */}
      {!isCollapsed && (
        <View style={styles.contentWrapper}>
          {/* Horizontal Manual Carousel showing 4 items per screen view */}
          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={(cardWidth + cardGap) * itemsPerPage}
            decelerationRate="fast"
            onScroll={handleScroll}
            scrollEventThrottle={16}
            contentContainerStyle={[styles.scrollContent, { gap: cardGap }]}
          >
            {STREAK_BADGES_DATA.map((badge) => {
              // Unlocked only if present in userBadges array from API, fallback to streak days
              const isUnlocked =
                Array.isArray(userBadges) && userBadges.length > 0
                  ? userBadges.some(
                      (b) =>
                        b.milestone_days === badge.dayNumber ||
                        (b.name && b.name.toLowerCase() === badge.title.toLowerCase())
                    )
                  : currentStreak >= badge.dayNumber;

              return (
                <TouchableOpacity
                  key={badge.id}
                  activeOpacity={0.8}
                  onPress={() => handlePressBadge(badge)}
                  style={[styles.badgeItemContainer, { width: cardWidth }]}
                >
                  {/* Badge Graphic (Top) */}
                  <View style={styles.imageWrapper}>
                    <Image
                      source={badge.imageSource}
                      style={[styles.badgeImage, !isUnlocked && styles.badgeImageMuted]}
                      resizeMode="contain"
                    />
                    {!isUnlocked && (
                      <View style={styles.normalLockOverlay}>
                        <Ionicons name="lock-closed" size={13} color="#A1A1AA" />
                      </View>
                    )}
                  </View>

                  {/* Days Text (Middle: e.g. "7 days") */}
                  <Text
                    style={[styles.daysText, isUnlocked ? styles.daysTextUnlocked : styles.daysTextLocked]}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.7}
                  >
                    {badge.daysText}
                  </Text>

                  {/* Badge Title (Bottom: e.g. "Ember Vow") */}
                  <Text
                    style={[styles.badgeTitle, isUnlocked ? styles.badgeTitleUnlocked : styles.badgeTitleMuted]}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.7}
                  >
                    {badge.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Pagination Dots (Below Carousel) */}
          <View style={styles.paginationRow}>
            {Array.from({ length: totalPages }).map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === activePageIndex ? styles.paginationDotActive : styles.paginationDotInactive,
                ]}
              />
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#1F1F26',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
    paddingVertical: 2,
    marginBottom: 4,
  },
  headerTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  contentWrapper: {
    marginTop: 2,
  },
  scrollContent: {
    paddingVertical: 2,
    paddingHorizontal: 0,
  },
  badgeItemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 2,
  },
  imageWrapper: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  badgeImage: {
    width: 46,
    height: 46,
  },
  badgeImageMuted: {
    opacity: 0.25,
  },
  normalLockOverlay: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(24, 24, 27, 0.85)',
    borderWidth: 1,
    borderColor: '#3F3F46',
    alignItems: 'center',
    justifyContent: 'center',
  },
  daysText: {
    fontFamily: fontFamilies.bold,
    fontSize: 12,
    marginBottom: 1,
    textAlign: 'center',
  },
  daysTextUnlocked: {
    color: '#FFFFFF',
  },
  daysTextLocked: {
    color: '#71717A',
  },
  badgeTitle: {
    fontFamily: fontFamilies.regular,
    fontSize: 10,
    textAlign: 'center',
  },
  badgeTitleUnlocked: {
    color: '#E4E4E7',
  },
  badgeTitleMuted: {
    color: '#52525B',
  },
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 6,
    marginBottom: 2,
  },
  paginationDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  paginationDotActive: {
    backgroundColor: '#FFFFFF',
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  paginationDotInactive: {
    backgroundColor: '#3F3F46',
  },
});
