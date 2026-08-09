import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Circle, Path } from 'react-native-svg';
import { fontFamilies } from '@/theme/typography';

export interface DayTrackerItem {
  dayName: string;
  dateNum: string;
  status: 'completed' | 'today' | 'locked';
  isToday?: boolean;
}

interface WeeklyTrackerProps {
  days?: DayTrackerItem[];
  streakDays?: number;
  completedDaysCount?: number;
  totalDaysCount?: number;
  subtitleMessage?: string;
  characterImageSource?: any;
  onDayPress?: (day: DayTrackerItem) => void;
}

const DEFAULT_DAYS: DayTrackerItem[] = [
  { dayName: 'MON', dateNum: '04', status: 'completed' },
  { dayName: 'TUE', dateNum: '05', status: 'completed' },
  { dayName: 'WED', dateNum: '06', status: 'completed' },
  { dayName: 'THU', dateNum: '07', status: 'today', isToday: true },
  { dayName: 'FRI', dateNum: '08', status: 'locked' },
  { dayName: 'SAT', dateNum: '09', status: 'locked' },
  { dayName: 'SUN', dateNum: '10', status: 'locked' },
];

const DEFAULT_CHARACTER_IMAGE = require('@/assets/images/Avatar2.png');

export function WeeklyTracker({
  days = DEFAULT_DAYS,
  streakDays = 5,
  completedDaysCount,
  totalDaysCount = 7,
  subtitleMessage = 'Track your progress. Consistency builds legends.',
  characterImageSource = DEFAULT_CHARACTER_IMAGE,
  onDayPress,
}: WeeklyTrackerProps) {
  const completedCount = completedDaysCount ?? days.filter(d => d.status === 'completed' || d.status === 'today').length;
  const imageSource = typeof characterImageSource === 'string' ? { uri: characterImageSource } : characterImageSource;

  // Circular Progress calculations
  const radius = 20;
  const strokeWidth = 4;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = totalDaysCount > 0 ? completedCount / totalDaysCount : 0;
  const strokeDashoffset = circumference * (1 - progressRatio);

  // Chevron Progress Bar renderer
  const renderSegmentedChevrons = () => {
    const totalSegments = 7;
    const viewWidth = 350;
    const viewHeight = 16;
    const stepWidth = viewWidth / totalSegments;
    const slant = 8;
    const gap = 2.5;

    return (
      <Svg
        width="100%"
        height={viewHeight}
        viewBox={`0 0 ${viewWidth} ${viewHeight}`}
        preserveAspectRatio="none"
      >
        {Array.from({ length: totalSegments }).map((_, index) => {
          const isFilled = index < completedCount;
          const fillColor = isFilled ? '#FE5B01' : '#26262E';

          const xLeft = index * stepWidth;
          const xRight = (index + 1) * stepWidth;

          let pathD = '';

          if (index === 0) {
            pathD = `M 4 0 L ${xRight - slant} 0 L ${xRight} 8 L ${xRight - slant} 16 L 4 16 C 1.8 16 0 14.2 0 12 L 0 4 C 0 1.8 1.8 0 4 0 Z`;
          } else if (index === totalSegments - 1) {
            pathD = `M ${xLeft - slant + gap} 0 L ${xRight - 4} 0 C ${xRight - 1.8} 0 ${xRight} 1.8 ${xRight} 4 L ${xRight} 12 C ${xRight} 14.2 ${xRight - 1.8} 16 ${xRight - 4} 16 L ${xLeft - slant + gap} 16 L ${xLeft + gap} 8 Z`;
          } else {
            pathD = `M ${xLeft - slant + gap} 0 L ${xRight - slant} 0 L ${xRight} 8 L ${xRight - slant} 16 L ${xLeft - slant + gap} 16 L ${xLeft + gap} 8 Z`;
          }

          return <Path key={index} d={pathD} fill={fillColor} />;
        })}
      </Svg>
    );
  };

  return (
    <View style={styles.container}>
      {/* HEADER ROW */}
      <View style={styles.headerRow}>
        <View style={styles.headerTitleGroup}>
          <View style={styles.titleWithIcon}>
            <View style={styles.orangeIconBadge}>
              <MaterialCommunityIcons name="star-four-points" size={14} color="#FE5B01" />
            </View>
            <Text style={styles.headerTitle}>WEEKLY TRACKER</Text>
          </View>
          <Text style={styles.headerSubtitle}>{subtitleMessage}</Text>
        </View>

        {/* STREAK BADGE */}
        <View style={styles.streakBadge}>
          <Ionicons name="flame" size={22} color="#FE5B01" style={styles.flameIcon} />
          <View style={styles.streakTextColumn}>
            <Text style={styles.streakLabel}>WEEKLY STREAK</Text>
            <Text style={styles.streakValue}>{streakDays} DAYS</Text>
          </View>
        </View>
      </View>

      {/* DAYS ROW WITH CONNECTING TIMELINE LINE */}
      <View style={styles.daysRowContainer}>
        {/* Background Connecting Timeline Line */}
        <View style={styles.timelineLineBackground}>
          <View style={styles.timelineLineCompleted} />
          <View style={styles.timelineLineRemaining} />
        </View>

        <View style={styles.daysRow}>
          {days.map((item, index) => {
            const isToday = item.isToday || item.status === 'today';
            const isCompleted = item.status === 'completed';
            const isLocked = item.status === 'locked';

            if (isToday) {
              return (
                <Pressable
                  key={index}
                  style={styles.todayCardContainer}
                  onPress={() => onDayPress?.(item)}
                >
                  <Text style={styles.todayDayName}>{item.dayName}</Text>

                  {/* Glowing Double Ring Star Icon */}
                  <View style={styles.todayStarCircleOuter}>
                    <View style={styles.todayStarCircleInner}>
                      <MaterialCommunityIcons name="star-four-points" size={16} color="#FFFFFF" />
                    </View>
                  </View>

                  <Text style={styles.todayDateNum}>{item.dateNum}</Text>

                  {/* TODAY Pill Badge */}
                  <View style={styles.todayPillBadge}>
                    <Text style={styles.todayPillText}>TODAY</Text>
                  </View>
                </Pressable>
              );
            }

            return (
              <Pressable
                key={index}
                style={styles.normalDayColumn}
                onPress={() => onDayPress?.(item)}
              >
                <Text style={styles.normalDayName}>{item.dayName}</Text>

                {/* Status Circle */}
                {isCompleted ? (
                  <View style={styles.completedCircle}>
                    <Ionicons name="checkmark" size={14} color="#FE5B01" />
                  </View>
                ) : (
                  <View style={styles.lockedCircle}>
                    <Ionicons name="lock-closed" size={12} color="#52525B" />
                  </View>
                )}

                <Text style={styles.normalDateNum}>{item.dateNum}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* BOTTOM CARD SECTION */}
      <View style={styles.bottomCard}>
        {/* Full-Height Right Overlay Character Image */}
        <View style={styles.characterImageWrapper} pointerEvents="none">
          <Image
            source={imageSource}
            style={styles.characterImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.bottomCardContent}>
          {/* Circular Progress & Completed Days */}
          <View style={styles.progressRingSection}>
            <View style={styles.ringWrapper}>
              <Svg width={48} height={48} viewBox="0 0 50 50">
                <Circle
                  cx="25"
                  cy="25"
                  r={radius}
                  stroke="#26262E"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                />
                <Circle
                  cx="25"
                  cy="25"
                  r={radius}
                  stroke="#FE5B01"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  transform="rotate(-90 25 25)"
                />
              </Svg>
            </View>

            <View style={styles.progressTextColumn}>
              <View style={styles.fractionRow}>
                <Text style={styles.fractionCompleted}>{completedCount}</Text>
                <Text style={styles.fractionTotal}>/{totalDaysCount}</Text>
              </View>
              <Text style={styles.progressLabel}>DAYS COMPLETED</Text>
            </View>
          </View>

          <View style={styles.verticalDivider} />

          {/* Middle Encouragement Text */}
          <View style={styles.encouragementSection}>
            <Text style={styles.encouragementTitle}>Keep it up, hunter!</Text>
            <Text style={styles.encouragementSubtext}>
              {totalDaysCount - completedCount} more days to complete
            </Text>
          </View>
        </View>

        {/* CHEVRON PROGRESS BAR */}
        <View style={styles.chevronContainer}>
          {renderSegmentedChevrons()}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0F0F12',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#202026',
    padding: 16,
    marginHorizontal: 0,
    marginVertical: 12,
    width: '100%',
  },

  /* HEADER */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  headerTitleGroup: {
    flex: 1,
    marginRight: 8,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  orangeIconBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FE5B01',
    backgroundColor: '#261208',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  headerTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 15,
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  headerSubtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: 11,
    color: '#8E8E93',
  },

  /* STREAK BADGE */
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16161A',
    borderWidth: 1,
    borderColor: '#282830',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  flameIcon: {
    marginRight: 6,
  },
  streakTextColumn: {
    alignItems: 'flex-start',
  },
  streakLabel: {
    fontFamily: fontFamilies.bold,
    fontSize: 8,
    color: '#8E8E93',
    letterSpacing: 0.5,
  },
  streakValue: {
    fontFamily: fontFamilies.bold,
    fontSize: 15,
    color: '#FE5B01',
  },

  /* DAYS ROW & TIMELINE LINE */
  daysRowContainer: {
    position: 'relative',
    marginBottom: 18,
    justifyContent: 'center',
  },
  timelineLineBackground: {
    position: 'absolute',
    top: 40,
    left: 24,
    right: 24,
    height: 2,
    flexDirection: 'row',
    zIndex: 0,
  },
  timelineLineCompleted: {
    flex: 5,
    backgroundColor: '#FE5B01',
  },
  timelineLineRemaining: {
    flex: 2,
    backgroundColor: '#282830',
  },

  daysRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1,
  },
  normalDayColumn: {
    alignItems: 'center',
    flex: 1,
  },
  normalDayName: {
    fontFamily: fontFamilies.medium,
    fontSize: 11,
    color: '#8E8E93',
    marginBottom: 8,
  },
  completedCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#FE5B01',
    backgroundColor: '#0F0F12',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  lockedCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#26262E',
    backgroundColor: '#0F0F12',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  normalDateNum: {
    fontFamily: fontFamilies.medium,
    fontSize: 12,
    color: '#71717A',
  },

  /* TODAY HIGHLIGHT CARD */
  todayCardContainer: {
    alignItems: 'center',
    backgroundColor: '#1C1814',
    borderWidth: 1.5,
    borderColor: '#FE5B01',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginHorizontal: 2,
    shadowColor: '#FE5B01',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
    zIndex: 2,
  },
  todayDayName: {
    fontFamily: fontFamilies.bold,
    fontSize: 11,
    color: '#FE5B01',
    marginBottom: 6,
  },
  todayStarCircleOuter: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: '#FE5B01',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#35180B',
    marginBottom: 6,
    shadowColor: '#FE5B01',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
  },
  todayStarCircleInner: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FE5B01',
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayDateNum: {
    fontFamily: fontFamilies.bold,
    fontSize: 13,
    color: '#FFFFFF',
    marginBottom: 6,
  },
  todayPillBadge: {
    backgroundColor: '#FE5B01',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  todayPillText: {
    fontFamily: fontFamilies.bold,
    fontSize: 8,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },

  /* BOTTOM CARD */
  bottomCard: {
    backgroundColor: '#141418',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#22222A',
    paddingTop: 12,
    paddingHorizontal: 12,
    paddingBottom: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  bottomCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
    zIndex: 1,
    paddingRight: 75,
  },

  /* PROGRESS RING SECTION */
  progressRingSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ringWrapper: {
    marginRight: 10,
  },
  progressTextColumn: {
    justifyContent: 'center',
  },
  fractionRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  fractionCompleted: {
    fontFamily: fontFamilies.bold,
    fontSize: 18,
    color: '#FFFFFF',
  },
  fractionTotal: {
    fontFamily: fontFamilies.bold,
    fontSize: 12,
    color: '#71717A',
  },
  progressLabel: {
    fontFamily: fontFamilies.bold,
    fontSize: 8,
    color: '#71717A',
    letterSpacing: 0.5,
    marginTop: 1,
  },

  verticalDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#26262E',
    marginHorizontal: 8,
  },

  /* ENCOURAGEMENT SECTION */
  encouragementSection: {
    flex: 1,
    paddingHorizontal: 6,
  },
  encouragementTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 13,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  encouragementSubtext: {
    fontFamily: fontFamilies.medium,
    fontSize: 11,
    color: '#FE5B01',
  },

  /* CHARACTER IMAGE OVERLAY */
  characterImageWrapper: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 24,
    width: 115,
    zIndex: 0,
    overflow: 'hidden',
  },
  characterImage: {
    width: '100%',
    height: '100%',
  },

  /* CHEVRON CONTAINER */
  chevronContainer: {
    width: '100%',
    height: 16,
    zIndex: 1,
  },
});
