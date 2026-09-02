import React from 'react';
import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ExactMedalIcon } from '@/components/common/ExactMedalIcon';
import { Screen } from '@/components/common/Screen';
import { fontFamilies } from '@/theme/typography';

export interface RecentActivityItem {
  id: string;
  day: number;
  title: string;
  xpReward: string;
  timeLabel: string;
}

const DEFAULT_RECENT_ACTIVITIES: RecentActivityItem[] = [
  { id: '1', day: 17, title: 'Wake up early', xpReward: '+10 XP', timeLabel: 'Today' },
  { id: '2', day: 13, title: 'Wake up early', xpReward: '+10 XP', timeLabel: 'Yesterday' },
  { id: '3', day: 13, title: 'Drink water', xpReward: '+10 XP', timeLabel: 'Yesterday' },
  { id: '4', day: 13, title: 'Social media limit', xpReward: '+10 XP', timeLabel: 'Yesterday' },
  { id: '5', day: 12, title: 'Wake up early', xpReward: '+10 XP', timeLabel: '2d ago' },
];

export interface RecentActivityModalProps {
  visible: boolean;
  onClose: () => void;
  activities?: RecentActivityItem[];
  user?: any;
}

export function RecentActivityModal({
  visible,
  onClose,
  activities = DEFAULT_RECENT_ACTIVITIES,
  user,
}: RecentActivityModalProps) {
  // Extract or format stats
  const memberSince = user?.created_at
    ? new Date(user.created_at)
        .toLocaleString('en-US', { month: 'short', year: 'numeric' })
        .toUpperCase()
    : 'AUG 2026';
  const currentStreak = user?.streak ?? user?.current_streak ?? 8;
  const currentStreakPadded =
    typeof currentStreak === 'number'
      ? String(currentStreak).padStart(2, '0')
      : String(currentStreak);
  const longestStreak = user?.longest_streak ?? user?.max_streak ?? user?.best_streak ?? 14;
  const totalTasksCompleted =
    user?.total_tasks_completed ?? user?.completed_tasks_count ?? user?.total_tasks ?? 42;

  const statRows = [
    [
      {
        id: 'member_since',
        label: 'MEMBER SINCE',
        value: memberSince,
        subtitle: 'AWAKENED',
        icon: <MaterialCommunityIcons name="calendar-month-outline" size={17} color="#38BDF8" />,
        accentColor: '#38BDF8',
      },
      {
        id: 'current_streak',
        label: 'CURRENT STREAK',
        value: currentStreakPadded,
        subtitle: 'DAYS ACTIVE',
        icon: <MaterialCommunityIcons name="fire" size={18} color="#FF7A00" />,
        accentColor: '#FF7A00',
      },
    ],
    [
      {
        id: 'best_record',
        label: 'BEST RECORD',
        value: `${longestStreak}`,
        subtitle: 'MAX STREAK',
        icon: <ExactMedalIcon size={18} color="#EAB308" bgColor="#141419" />,
        accentColor: '#EAB308',
      },
      {
        id: 'quests_cleared',
        label: 'QUESTS CLEARED',
        value: `${totalTasksCompleted}`,
        subtitle: 'TOTAL LOGS',
        icon: <Ionicons name="checkmark" size={17} color="#10B981" />,
        accentColor: '#10B981',
      },
    ],
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Screen style={styles.screen}>
        {/* Modern Minimal Header */}
        <View style={styles.headerBar}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your Activity</Text>
          <View style={styles.headerRightSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* TACTICAL MINIMAL 2X2 STATS GRID */}
          <View style={styles.statsContainer}>
            {statRows.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.statsRow}>
                {row.map((stat) => (
                  <View key={stat.id} style={styles.statCard}>
                    <LinearGradient
                      colors={['#141419', '#0E0E12']}
                      style={styles.statCardGradient}
                    >
                      {/* Top: Icon & Monospace Label */}
                      <View style={styles.statHeaderRow}>
                        <View style={styles.iconWrap}>{stat.icon}</View>
                        <Text style={styles.statLabelText}>{stat.label}</Text>
                      </View>

                      {/* Middle: Big Metric Value */}
                      <Text style={styles.statValueText}>{stat.value}</Text>

                      {/* Bottom: Colored Tactical Subtitle */}
                      <Text style={[styles.statSubtitleText, { color: stat.accentColor }]}>
                        {stat.subtitle}
                      </Text>
                    </LinearGradient>
                  </View>
                ))}
              </View>
            ))}
          </View>

          {/* RECENT QUEST LOGS SECTION */}
          <View style={styles.questSectionHeaderRow}>
            <Text style={styles.questsSectionTitle}>RECENT QUEST LOGS</Text>
            <View style={styles.questCountPill}>
              <Text style={styles.questCountText}>{activities.length} LOGGED</Text>
            </View>
          </View>

          {/* RECENT TASKS CONTAINER */}
          <View style={styles.recentTasksListContainer}>
            {activities.map((item, index) => {
              const isLast = index === activities.length - 1;
              return (
                <View
                  key={item.id}
                  style={[
                    styles.recentTaskItemRow,
                    !isLast && styles.recentTaskItemBorder,
                  ]}
                >
                  {/* Anime Day Box */}
                  <View style={styles.recentDayBox}>
                    <Text style={styles.recentDayLabel}>DAY</Text>
                    <Text style={styles.recentDayNumber}>{item.day}</Text>
                  </View>

                  {/* Task Info */}
                  <View style={styles.taskInfoWrap}>
                    <Text style={styles.recentTaskTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.recentTimeText}>{item.timeLabel}</Text>
                  </View>

                  {/* XP Badge */}
                  <View style={styles.recentXpBadge}>
                    <MaterialCommunityIcons
                      name="lightning-bolt"
                      size={12}
                      color="#FE5B01"
                      style={{ marginRight: 2 }}
                    />
                    <Text style={styles.recentXpText}>{item.xpReward}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </Screen>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#09090B',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 8 : 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1E',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#141418',
    borderWidth: 1,
    borderColor: '#24242A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  headerRightSpacer: {
    width: 38,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 50,
    gap: 22,
  },

  /* 2X2 TACTICAL STATS GRID */
  statsContainer: {
    gap: 12,
    width: '100%',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  statCard: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#202028',
    backgroundColor: '#111116',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  statCardGradient: {
    paddingHorizontal: 16,
    paddingVertical: 18,
    gap: 12,
    minHeight: 128,
  },
  statHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconWrap: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabelText: {
    fontFamily: fontFamilies.bold,
    fontSize: 10.5,
    color: '#8E8E98',
    letterSpacing: 1.2,
    fontWeight: '800',
  },
  statValueText: {
    fontFamily: fontFamilies.bold,
    fontSize: 23,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  statSubtitleText: {
    fontFamily: fontFamilies.bold,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },

  /* RECENT QUEST LOGS */
  questSectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginTop: 2,
  },
  questsSectionTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 12,
    fontWeight: '800',
    color: '#A1A1AA',
    letterSpacing: 1,
  },
  questCountPill: {
    backgroundColor: '#16161B',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#24242A',
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  questCountText: {
    fontFamily: fontFamilies.bold,
    fontSize: 9.5,
    color: '#71717A',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  recentTasksListContainer: {
    backgroundColor: '#121216',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#222228',
    overflow: 'hidden',
  },
  recentTaskItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 14,
  },
  recentTaskItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A22',
  },
  recentDayBox: {
    backgroundColor: 'rgba(254, 91, 1, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(254, 91, 1, 0.3)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 42,
  },
  recentDayLabel: {
    fontFamily: fontFamilies.bold,
    fontSize: 8,
    fontWeight: '900',
    color: '#FE5B01',
    lineHeight: 9,
  },
  recentDayNumber: {
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 16,
  },
  taskInfoWrap: {
    flex: 1,
    gap: 3,
  },
  recentTaskTitle: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  recentTimeText: {
    fontFamily: fontFamilies.regular,
    fontSize: 11.5,
    color: '#71717A',
  },
  recentXpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(254, 91, 1, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(254, 91, 1, 0.28)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  recentXpText: {
    fontFamily: fontFamilies.bold,
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FE5B01',
  },
});
