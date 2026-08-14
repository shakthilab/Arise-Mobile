import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
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
  { dayName: 'MON', dateNum: '05', status: 'completed' },
  { dayName: 'TUE', dateNum: '06', status: 'completed' },
  { dayName: 'WED', dateNum: '07', status: 'completed' },
  { dayName: 'THU', dateNum: '08', status: 'completed' },
  { dayName: 'FRI', dateNum: '09', status: 'today', isToday: true },
  { dayName: 'SAT', dateNum: '10', status: 'locked' },
  { dayName: 'SUN', dateNum: '11', status: 'locked' },
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
  const completedCount =
    completedDaysCount ?? days.filter(d => d.status === 'completed' || d.status === 'today').length;
  const imageSource =
    typeof characterImageSource === 'string' ? { uri: characterImageSource } : characterImageSource;

  // Calculate active index for the timeline connecting path line
  const activeIndex = useMemo(() => {
    const todayIdx = days.findIndex(d => d.isToday || d.status === 'today');
    if (todayIdx !== -1) return todayIdx;
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].status === 'completed') return i;
    }
    return 0;
  }, [days]);

  const totalDays = days.length;
  const completedRatio = totalDays > 1 ? activeIndex / (totalDays - 1) : 0;

  // Animated moving path progress line
  const pathAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    pathAnim.setValue(0);
    Animated.timing(pathAnim, {
      toValue: completedRatio,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [completedRatio]);

  // Node horizontal margins for 7 items
  const nodeMarginPercent = (1 / (2 * totalDays)) * 100; // ~7.14%

  // Circular Progress calculations
  const radius = 20;
  const strokeWidth = 4;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = totalDaysCount > 0 ? completedCount / totalDaysCount : 0;
  const strokeDashoffset = circumference * (1 - progressRatio);

  return (
    <View style={styles.container}>
      {/* DAYS ROW WITH MOVING PATH TIMELINE LINE */}
      <View style={styles.daysRowContainer}>
        {/* Background Connecting Timeline Line */}
        <View
          style={[
            styles.timelineLineBackground,
            { left: `${nodeMarginPercent}%`, right: `${nodeMarginPercent}%` },
          ]}
        >
          {/* Base Inactive Path Line */}
          <View style={styles.timelineBaseLine} />

          {/* Animated Active Glowing Orange Moving Path */}
          <Animated.View
            style={[
              styles.timelineActiveLine,
              {
                width: pathAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          >
            <LinearGradient
              colors={['#FE5B01', '#FF8800', '#FE5B01']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
            {/* Glowing particle head at the moving path tip */}
            <View style={styles.timelineLeadGlow} />
          </Animated.View>
        </View>

        {/* Days List */}
        <View style={styles.daysRow}>
          {days.map((item, index) => {
            const isToday = item.isToday || item.status === 'today';
            const isCompleted = item.status === 'completed';

            if (isToday) {
              return (
                <Pressable
                  key={index}
                  style={styles.todayCardContainer}
                  onPress={() => onDayPress?.(item)}
                >
                  <Text style={styles.todayDayName}>{item.dayName}</Text>

                  {/* Circle Node inside TODAY card */}
                  <View style={styles.todayCircleNode}>
                    <Ionicons name="checkmark" size={16} color="#FE5B01" />
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

                {/* Status Circle Node */}
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
          <Image source={imageSource} style={styles.characterImage} resizeMode="cover" />
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
              <Text style={styles.orangeHighlightNumber}>
                {Math.max(0, totalDaysCount - completedCount)}
              </Text>
              {' more days to complete'}
            </Text>
          </View>
        </View>

        {/* BOTTOM SEGMENTED PROGRESS BAR */}
        <View style={styles.segmentedBarRow}>
          {Array.from({ length: totalDaysCount }).map((_, index) => {
            const isFilled = index < completedCount;
            return (
              <View
                key={index}
                style={[
                  styles.segmentBarItem,
                  { backgroundColor: isFilled ? '#FE5B01' : '#26262E' },
                ]}
              />
            );
          })}
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

  /* DAYS ROW & MOVING TIMELINE PATH */
  daysRowContainer: {
    position: 'relative',
    marginBottom: 18,
    justifyContent: 'center',
  },
  timelineLineBackground: {
    position: 'absolute',
    top: 38,
    height: 3,
    zIndex: 0,
  },
  timelineBaseLine: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#26262E',
    borderRadius: 2,
  },
  timelineActiveLine: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 2,
    overflow: 'visible',
    shadowColor: '#FE5B01',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 4,
  },
  timelineLeadGlow: {
    position: 'absolute',
    right: -4,
    top: -2,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#FFFFFF',
    shadowColor: '#FE5B01',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 6,
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
    color: '#FFFFFF',
    marginBottom: 8,
  },
  completedCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: '#FE5B01',
    backgroundColor: '#0F0F12',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#FE5B01',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  lockedCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
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
    color: '#FFFFFF',
  },

  /* TODAY HIGHLIGHT CARD */
  todayCardContainer: {
    alignItems: 'center',
    flex: 1,
    alignSelf: 'stretch',
    marginVertical: -10,
    paddingTop: 6,
    paddingBottom: 0,
    paddingHorizontal: 0,
    backgroundColor: '#1E1915',
    borderWidth: 1.5,
    borderColor: '#FE5B01',
    borderRadius: 14,
    overflow: 'hidden',
    justifyContent: 'space-between',
    shadowColor: '#FE5B01',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 2,
  },
  todayDayName: {
    fontFamily: fontFamilies.bold,
    fontSize: 11,
    color: '#FFFFFF',
    marginTop: 2,
    marginBottom: 4,
  },
  todayCircleNode: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: '#FE5B01',
    backgroundColor: '#2A170D',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    shadowColor: '#FE5B01',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  todayDateNum: {
    fontFamily: fontFamilies.bold,
    fontSize: 12,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  todayPillBadge: {
    backgroundColor: '#FE5B01',
    width: '100%',
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayPillText: {
    fontFamily: fontFamilies.bold,
    fontSize: 9,
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },

  /* BOTTOM CARD */
  bottomCard: {
    backgroundColor: '#141418',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#22222A',
    paddingTop: 12,
    paddingHorizontal: 12,
    paddingBottom: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  bottomCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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
    color: '#8E8E93',
  },
  orangeHighlightNumber: {
    fontFamily: fontFamilies.bold,
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

  /* SEGMENTED BAR */
  segmentedBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    zIndex: 1,
  },
  segmentBarItem: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 2,
  },
});

