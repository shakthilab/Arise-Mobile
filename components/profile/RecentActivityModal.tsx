import React, { useState, useEffect, useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Platform,
  RefreshControl,
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
import {
  fetchUserActivity,
  UserActivityLog,
  UserActivityPagination,
  UserActivitySummary,
} from '@/services/api/user.service';

export interface RecentActivityModalProps {
  visible: boolean;
  onClose: () => void;
  activities?: any[];
  user?: any;
}

export function RecentActivityModal({
  visible,
  onClose,
  user,
}: RecentActivityModalProps) {
  const [logs, setLogs] = useState<UserActivityLog[]>([]);
  const [summary, setSummary] = useState<UserActivitySummary | null>(null);
  const [pagination, setPagination] = useState<UserActivityPagination | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadInitialActivity = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchUserActivity(1, 10);
      setSummary(data.summary);
      setLogs(data.logs || []);
      setPagination(data.pagination);
    } catch (err) {
      console.warn('[RecentActivityModal] Error fetching activity:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (visible) {
      loadInitialActivity();
    }
  }, [visible, loadInitialActivity]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const data = await fetchUserActivity(1, 10);
      setSummary(data.summary);
      setLogs(data.logs || []);
      setPagination(data.pagination);
    } catch (err) {
      console.warn('[RecentActivityModal] Error refreshing activity:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLoadMore = async () => {
    if (isLoadingMore || isLoading || isRefreshing) return;
    if (!pagination || !pagination.has_next_page) return;

    const nextPage = pagination.page + 1;
    try {
      setIsLoadingMore(true);
      const data = await fetchUserActivity(nextPage, 10);
      if (data && data.logs && data.logs.length > 0) {
        setLogs((prev) => {
          const existingIds = new Set(prev.map((item) => String(item.id)));
          const newItems = data.logs.filter((item) => !existingIds.has(String(item.id)));
          return [...prev, ...newItems];
        });
      }
      if (data.summary) setSummary(data.summary);
      if (data.pagination) setPagination(data.pagination);
    } catch (err) {
      console.warn('[RecentActivityModal] Error loading more activity:', err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Stats calculation
  const memberSinceStr = summary?.member_since || user?.created_at;
  const memberSince = memberSinceStr
    ? new Date(memberSinceStr)
        .toLocaleString('en-US', { month: 'short', year: 'numeric' })
        .toUpperCase()
    : 'AUG 2026';

  const currentStreak = summary?.current_streak ?? user?.streak ?? user?.current_streak ?? 0;
  const currentStreakPadded = String(currentStreak).padStart(2, '0');

  const longestStreak = summary?.best_record ?? user?.longest_streak ?? user?.max_streak ?? 0;
  const totalTasksCompleted = summary?.total_quests_cleared ?? user?.total_tasks_completed ?? 0;

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

  const renderHeader = () => (
    <View style={styles.headerContentWrapper}>
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
          <Text style={styles.questCountText}>{pagination?.total_count ?? logs.length} LOGGED</Text>
        </View>
      </View>
    </View>
  );

function formatDateBadge(item: UserActivityLog): { month: string; day: string } {
  let dateObj: Date | null = null;

  if (item.schedule_date) {
    const parts = item.schedule_date.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const monthIndex = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      dateObj = new Date(year, monthIndex, day);
    }
  }

  if (!dateObj && item.completed_at) {
    dateObj = new Date(item.completed_at);
  }

  if (dateObj && !isNaN(dateObj.getTime())) {
    const month = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const day = String(dateObj.getDate());
    return { month, day };
  }

  const fallbackMonth = new Date().toLocaleString('en-US', { month: 'short' }).toUpperCase();
  return {
    month: fallbackMonth,
    day: String(item.day_number ?? 1),
  };
}

  const renderLogItem = ({ item, index }: { item: UserActivityLog; index: number }) => {
    const isLast = index === logs.length - 1;
    const { month, day } = formatDateBadge(item);
    const timeLabel = item.date_label || (item.completed_at ? new Date(item.completed_at).toLocaleDateString() : 'Today');

    return (
      <View
        style={[
          styles.recentTaskItemRow,
          !isLast && styles.recentTaskItemBorder,
        ]}
      >
        {/* Date Box: Month (SEP/AUG) on top, Day (3/4/31) below */}
        <View style={styles.recentDayBox}>
          <Text style={styles.recentDayLabel}>{month}</Text>
          <Text style={styles.recentDayNumber}>{day}</Text>
        </View>

        {/* Task Info */}
        <View style={styles.taskInfoWrap}>
          <Text style={styles.recentTaskTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.recentTimeText}>{timeLabel}</Text>
        </View>

        {/* XP Badge */}
        <View style={styles.recentXpBadge}>
          <MaterialCommunityIcons
            name="lightning-bolt"
            size={12}
            color="#FE5B01"
            style={{ marginRight: 2 }}
          />
          <Text style={styles.recentXpText}>+{item.xp_earned} XP</Text>
        </View>
      </View>
    );
  };

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.footerLoaderWrap}>
        <ActivityIndicator size="small" color="#FE5B01" />
      </View>
    );
  };

  const renderEmptyState = () => {
    if (isLoading) return null;
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons name="clipboard-text-outline" size={40} color="#3F3F46" />
        <Text style={styles.emptyTitle}>No Activities Yet</Text>
        <Text style={styles.emptySubtext}>Complete daily quests to build your activity history.</Text>
      </View>
    );
  };

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
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Activities</Text>
          <View style={styles.headerRightSpacer} />
        </View>

        {isLoading && logs.length === 0 ? (
          <View style={styles.initialLoadingWrap}>
            <ActivityIndicator size="large" color="#FE5B01" />
            <Text style={styles.loadingText}>Loading activities...</Text>
          </View>
        ) : (
          <FlatList
            data={logs}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            renderItem={renderLogItem}
            ListHeaderComponent={renderHeader}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={renderEmptyState}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.3}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                tintColor="#FE5B01"
                colors={['#FE5B01']}
              />
            }
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
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
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 50,
  },
  headerContentWrapper: {
    gap: 22,
    marginBottom: 14,
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
  recentTaskItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 14,
    backgroundColor: '#121216',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#222228',
    marginBottom: 10,
  },
  recentTaskItemBorder: {},
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
  initialLoadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontFamily: fontFamilies.medium,
    fontSize: 13,
    color: '#A1A1AA',
  },
  footerLoaderWrap: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
    gap: 8,
  },
  emptyTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 15,
    color: '#E4E4E7',
    marginTop: 4,
  },
  emptySubtext: {
    fontFamily: fontFamilies.regular,
    fontSize: 12.5,
    color: '#71717A',
    textAlign: 'center',
  },
});
