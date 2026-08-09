import React, { useState } from 'react';
import {
  Animated,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { Screen } from '@/components/common/Screen';
import { ExactMedalIcon } from '@/components/common/ExactMedalIcon';
import { LootDropModal } from '@/components/features/loot/LootDropModal';
import { QuestActionModal } from '@/components/features/missions/QuestActionModal';
import { WeeklyTracker } from '@/components/features/streaks/WeeklyTracker';
import { useAuth } from '@/hooks/useAuth';
import { useLootDrop } from '@/hooks/useLootDrop';
import { fontFamilies } from '@/theme/typography';

export interface QuestItem {
  id: string;
  title: string;
  category: string;
  xpReward: number;
  type: 'daily' | 'weekly';
  image: any;
  status: 'todo' | 'done' | 'partial' | 'skipped';
  earnedXp?: number;
  showTickButton?: boolean;
  showWrongButton?: boolean;
  hasStatusPopup?: boolean;
  imageHeight?: number;
  imageStyle?: any;
  targetValue?: string;
}

const INITIAL_QUESTS: QuestItem[] = [
  {
    id: '1',
    title: 'Sleep 8 Hours',
    category: 'REST',
    xpReward: 50,
    type: 'daily',
    showTickButton: true,
    showWrongButton: true,
    hasStatusPopup: false,
    imageHeight: 120,
    image: require('@/assets/images/sleep.jpg'),
    status: 'todo',
  },
  {
    id: '2',
    title: 'Drink 3L Water',
    category: 'HYDRATE',
    xpReward: 50,
    type: 'daily',
    showTickButton: true,
    showWrongButton: true,
    hasStatusPopup: true,
    image: require('@/assets/images/threelitterwater.jpeg'),
    status: 'todo',
  },
  {
    id: '3',
    title: 'Protein Goal',
    category: 'NUTRITION',
    xpReward: 50,
    type: 'daily',
    showTickButton: true,
    showWrongButton: true,
    hasStatusPopup: true,
    targetValue: '128 g',
    image: require('@/assets/images/nutrition.jpeg'),
    imageStyle: { height: 170, top: -25 },
    status: 'todo',
  },
  {
    id: '4',
    title: 'Run 10km',
    category: 'CARDIO',
    xpReward: 50,
    type: 'weekly',
    showTickButton: true,
    showWrongButton: true,
    hasStatusPopup: false,
    image: require('@/assets/images/run.jpeg'),
    status: 'todo',
  },
];

const ANIME_AVATARS = [
  'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=400&auto=format&fit=crop',
];

function AnimatedTickButton({ onPress }: { onPress: () => void }) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePress = (e: any) => {
    e.stopPropagation();
    onPress();

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.15,
        duration: 40,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1.0,
        duration: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Pressable onPress={handlePress}>
      <Animated.View
        style={[
          styles.creamSquareTickButton,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Ionicons
          name="checkmark"
          size={16}
          color="#262626"
        />
      </Animated.View>
    </Pressable>
  );
}

function AnimatedWrongButton({ onPress }: { onPress: () => void }) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePress = (e: any) => {
    e.stopPropagation();
    onPress();

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.15,
        duration: 40,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1.0,
        duration: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Pressable onPress={handlePress}>
      <Animated.View
        style={[
          styles.redSquareWrongButton,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Ionicons
          name="close"
          size={16}
          color="#FFFFFF"
        />
      </Animated.View>
    </Pressable>
  );
}

export default function MissionsHomeScreen() {
  const { user } = useAuth();
  const { lastDrop, roll } = useLootDrop();
  const [dropVisible, setDropVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'todo' | 'done' | 'skipped'>('todo');

  const [quests, setQuests] = useState<QuestItem[]>(INITIAL_QUESTS);
  const [selectedQuest, setSelectedQuest] = useState<QuestItem | null>(null);
  const [actionModalVisible, setActionModalVisible] = useState(false);

  const displayName = user?.displayName ? user.displayName.toUpperCase() : 'SEYMEN';
  const displayXP = (user?.xp ?? 1240).toLocaleString();
  const displayLevel = user?.level ?? 8;
  const displayStreak = user?.currentStreak ?? 16;

  const todoQuests = quests.filter((q) => q.status === 'todo');
  const doneQuests = quests.filter((q) => q.status === 'done' || q.status === 'partial');
  const skippedQuests = quests.filter((q) => q.status === 'skipped');

  const dailyTodoQuests = todoQuests.filter((q) => q.type === 'daily');
  const weeklyTodoQuests = todoQuests.filter((q) => q.type === 'weekly');

  const handleOpenQuestActions = (quest: QuestItem) => {
    if (quest.showTickButton === false) return;
    if (quest.hasStatusPopup === false) {
      setQuests((prev) =>
        prev.map((q) =>
          q.id === quest.id ? { ...q, status: 'done', earnedXp: quest.xpReward } : q
        )
      );
      return;
    }
    setSelectedQuest(quest);
    setActionModalVisible(true);
  };

  const handleFullComplete = () => {
    if (!selectedQuest) return;
    const qId = selectedQuest.id;
    setQuests((prev) =>
      prev.map((q) =>
        q.id === qId ? { ...q, status: 'done', earnedXp: q.xpReward } : q
      )
    );
    setActionModalVisible(false);
  };

  const handlePartialComplete = () => {
    if (!selectedQuest) return;
    const qId = selectedQuest.id;
    const partialXp = Math.round(selectedQuest.xpReward / 2);
    setQuests((prev) =>
      prev.map((q) =>
        q.id === qId ? { ...q, status: 'partial', earnedXp: partialXp } : q
      )
    );
    setActionModalVisible(false);
  };

  const handleSkip = () => {
    if (!selectedQuest) return;
    const qId = selectedQuest.id;
    setQuests((prev) =>
      prev.map((q) =>
        q.id === qId ? { ...q, status: 'skipped', earnedXp: 0 } : q
      )
    );
    setActionModalVisible(false);
  };

  const handleDirectSkip = (questId: string) => {
    setQuests((prev) =>
      prev.map((q) =>
        q.id === questId ? { ...q, status: 'skipped', earnedXp: 0 } : q
      )
    );
  };

  const handleResetQuest = (questId: string) => {
    setQuests((prev) =>
      prev.map((q) =>
        q.id === questId ? { ...q, status: 'todo', earnedXp: undefined } : q
      )
    );
  };

  return (
    <Screen style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* TOP HEADER */}
        <View style={styles.topHeader}>
          <View style={styles.userProfileGroup}>
            <View style={styles.avatarWrapper}>
              <Image source={{ uri: ANIME_AVATARS[0] }} style={styles.avatarImage} />
              <View style={styles.levelBadgeCircle}>
                <Text style={styles.levelBadgeText}>{displayLevel}</Text>
              </View>
            </View>

            <View style={styles.userTitles}>
              <Text style={styles.greetingText}>HEY, {displayName}!</Text>
              <Text style={styles.xpSubtext}>{displayXP} XP · ARISE, HUNTER.</Text>
            </View>
          </View>

          <View style={styles.headerActions}>
            <View style={styles.streakPill}>
              <Ionicons name="flame" size={20} color="#FF5500" />
              <Text style={styles.streakText}>{displayStreak}</Text>
            </View>

            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="notifications-outline" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* WEEKLY TRACKER (2ND ITEM) */}
        <WeeklyTracker streakDays={displayStreak} completedDaysCount={4} />

        {/* ACTIVE CAMPAIGN SECTION */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitleWide}>ACTIVE CAMPAIGN</Text>
          <Text style={styles.dayCounterText}>Day 01 / 100</Text>
        </View>

        <View style={styles.campaignCardContainer}>
          <ImageBackground
            source={require('@/assets/images/active_campaign_bg.jpg')}
            style={styles.campaignBgImage}
            imageStyle={styles.campaignBgStyle}
          >
            <View style={styles.campaignOverlay}>
              {/* Main Banner Title */}
              <View style={styles.campaignTitleContainer}>
                <Text style={styles.campaignTitleLine}>RISE</Text>
                <Text style={styles.campaignTitleLine}>AGAIN</Text>
              </View>

              {/* Bottom details row */}
              <View style={styles.campaignDetailsRow}>
                <View>
                  <Text style={styles.campaignDetailLabel}>OBJECTIVE</Text>
                  <Text style={styles.campaignDetailValue}>Complete 4 Quests</Text>
                </View>

                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.campaignDetailLabel}>PROGRESS</Text>
                  <Text style={styles.campaignDetailValue}>0/4</Text>
                </View>
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* FILTER TABS ROW */}
        <View style={styles.filterTabsRow}>
          {/* TODO Tab */}
          <Pressable
            style={[
              styles.filterTab,
              activeTab === 'todo' ? styles.filterTabActive : styles.filterTabInactive,
            ]}
            onPress={() => setActiveTab('todo')}
          >
            <Text
              style={[
                styles.filterTabText,
                activeTab === 'todo' ? styles.filterTabTextActive : styles.filterTabTextInactive,
              ]}
            >
              TODO
            </Text>
            <View
              style={[
                styles.tabBadge,
                activeTab === 'todo' ? styles.tabBadgeActive : styles.tabBadgeInactive,
              ]}
            >
              <Text
                style={[
                  styles.tabBadgeText,
                  activeTab === 'todo' ? styles.tabBadgeTextActive : styles.tabBadgeTextInactive,
                ]}
              >
                {todoQuests.length}
              </Text>
            </View>
          </Pressable>

          {/* DONE Tab */}
          <Pressable
            style={[
              styles.filterTab,
              activeTab === 'done' ? styles.filterTabActive : styles.filterTabInactive,
            ]}
            onPress={() => setActiveTab('done')}
          >
            <Text
              style={[
                styles.filterTabText,
                activeTab === 'done' ? styles.filterTabTextActive : styles.filterTabTextInactive,
              ]}
            >
              DONE
            </Text>
            <View
              style={[
                styles.tabBadge,
                activeTab === 'done' ? styles.tabBadgeActive : styles.tabBadgeInactive,
              ]}
            >
              <Text
                style={[
                  styles.tabBadgeText,
                  activeTab === 'done' ? styles.tabBadgeTextActive : styles.tabBadgeTextInactive,
                ]}
              >
                {doneQuests.length}
              </Text>
            </View>
          </Pressable>

          {/* SKIPPED Tab */}
          <Pressable
            style={[
              styles.filterTab,
              activeTab === 'skipped' ? styles.filterTabActive : styles.filterTabInactive,
            ]}
            onPress={() => setActiveTab('skipped')}
          >
            <Text
              style={[
                styles.filterTabText,
                activeTab === 'skipped' ? styles.filterTabTextActive : styles.filterTabTextInactive,
              ]}
            >
              SKIPPED
            </Text>
            <View
              style={[
                styles.tabBadge,
                activeTab === 'skipped' ? styles.tabBadgeActive : styles.tabBadgeInactive,
              ]}
            >
              <Text
                style={[
                  styles.tabBadgeText,
                  activeTab === 'skipped' ? styles.tabBadgeTextActive : styles.tabBadgeTextInactive,
                ]}
              >
                {skippedQuests.length}
              </Text>
            </View>
          </Pressable>
        </View>

        {/* CONDITIONALLY RENDER CONTENT BASED ON ACTIVE FILTER TAB */}
        {activeTab === 'todo' && (
          <>
            {todoQuests.length === 0 ? (
              <View style={styles.emptyStateCard}>
                <Ionicons name="checkmark-done-circle-outline" size={54} color="#22C55E" />
                <Text style={styles.emptyStateTitle}>All Quests Settled!</Text>
                <Text style={styles.emptyStateSubtext}>
                  Great job! You have completed or skipped all active quests.
                </Text>
              </View>
            ) : (
              <>
                {/* ROUTINE QUESTS Section */}
                {dailyTodoQuests.length > 0 && (
                  <>
                    <Text style={styles.sectionMonoLabel}>ROUTINE QUESTS</Text>
                    {dailyTodoQuests.map((quest) => (
                      <View key={quest.id} style={styles.questCard}>
                        <View style={styles.questImageWrapper}>
                          <Image source={quest.image} style={[styles.questImage, quest.imageStyle]} />

                          <View style={styles.bottomLeftImageBadge}>
                            <Ionicons name="repeat-outline" size={12} color="#A1A1AA" />
                            <Text style={styles.routineBadgeText}>Routine</Text>
                          </View>

                          <View style={styles.topRightActionsCol}>
                            <View style={styles.xpBadgeInline}>
                              <Text style={styles.xpBadgeText}>+{quest.xpReward} XP</Text>
                            </View>

                            {quest.showTickButton !== false && (
                              <AnimatedTickButton onPress={() => handleOpenQuestActions(quest)} />
                            )}

                            {quest.showWrongButton !== false && (
                              <AnimatedWrongButton onPress={() => handleDirectSkip(quest.id)} />
                            )}
                          </View>
                        </View>

                        <View style={styles.questBody}>
                          <View style={styles.questTitleCol}>
                            <View style={styles.categoryPill}>
                              <Text style={styles.categoryPillText}>{quest.category}</Text>
                            </View>
                            <Text style={styles.questTitle}>{quest.title}</Text>
                          </View>

                          {quest.targetValue && (
                            <View style={styles.targetValueBox}>
                              <Text style={styles.targetValueText}>{quest.targetValue}</Text>
                            </View>
                          )}
                        </View>
                      </View>
                    ))}
                  </>
                )}

                {/* WEEKLY QUESTS Section */}
                {weeklyTodoQuests.length > 0 && (
                  <>
                    <Text style={[styles.sectionMonoLabel, { marginTop: 24 }]}>WEEKLY QUESTS</Text>
                    {weeklyTodoQuests.map((quest) => (
                      <View key={quest.id} style={styles.questCard}>
                        <View style={styles.questImageWrapper}>
                          <Image source={quest.image} style={[styles.questImage, quest.imageStyle]} />

                          <View style={styles.bottomLeftImageBadge}>
                            <Ionicons name="repeat-outline" size={12} color="#A1A1AA" />
                            <Text style={styles.routineBadgeText}>Weekly</Text>
                          </View>

                          <View style={styles.topRightActionsCol}>
                            <View style={styles.xpBadgeInline}>
                              <Text style={styles.xpBadgeText}>+{quest.xpReward} XP</Text>
                            </View>

                            {quest.showTickButton !== false && (
                              <AnimatedTickButton onPress={() => handleOpenQuestActions(quest)} />
                            )}

                            {quest.showWrongButton !== false && (
                              <AnimatedWrongButton onPress={() => handleDirectSkip(quest.id)} />
                            )}
                          </View>
                        </View>

                        <View style={styles.questBody}>
                          <View style={styles.questTitleCol}>
                            <View style={styles.categoryPill}>
                              <Text style={styles.categoryPillText}>{quest.category}</Text>
                            </View>
                            <Text style={styles.questTitle}>{quest.title}</Text>
                          </View>

                          {quest.targetValue && (
                            <View style={styles.targetValueBox}>
                              <Text style={styles.targetValueText}>{quest.targetValue}</Text>
                            </View>
                          )}
                        </View>
                      </View>
                    ))}
                  </>
                )}
              </>
            )}
          </>
        )}

        {/* DONE TAB */}
        {activeTab === 'done' && (
          <>
            {doneQuests.length === 0 ? (
              <View style={styles.emptyStateCard}>
                <ExactMedalIcon size={56} color="#71717A" />
                <Text style={styles.emptyStateTitle}>Nothing Completed Yet</Text>
                <Text style={styles.emptyStateSubtext}>
                  Tap the tick box on any quest to update its status.
                </Text>
              </View>
            ) : (
              doneQuests.map((quest) => {
                const isPartial = quest.status === 'partial';
                return (
                  <View key={quest.id} style={styles.questCard}>
                    <View style={styles.questImageWrapper}>
                      <Image source={quest.image} style={[styles.questImage, quest.imageStyle]} />

                      <View style={styles.bottomLeftImageBadge}>
                        <Ionicons name="repeat-outline" size={12} color="#A1A1AA" />
                        <Text style={styles.routineBadgeText}>{quest.type === 'daily' ? 'Routine' : 'Weekly'}</Text>
                      </View>

                      <View
                        style={[
                          styles.xpBadgeTopRight,
                          isPartial ? styles.partialBadgeContainer : styles.doneBadgeContainer,
                        ]}
                      >
                        <Ionicons
                          name={isPartial ? 'pie-chart' : 'checkmark-circle'}
                          size={14}
                          color={isPartial ? '#F59E0B' : '#22C55E'}
                        />
                        <Text
                          style={[
                            styles.xpBadgeText,
                            { color: isPartial ? '#F59E0B' : '#22C55E' },
                          ]}
                        >
                          {isPartial ? `PARTIAL (+${quest.earnedXp} XP)` : `DONE (+${quest.earnedXp} XP)`}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.questBody}>
                      <View style={styles.questTitleCol}>
                        <View style={styles.categoryPill}>
                          <Text style={styles.categoryPillText}>{quest.category}</Text>
                        </View>
                        <Text style={styles.questTitle}>{quest.title}</Text>
                      </View>

                      <TouchableOpacity
                        style={styles.undoButton}
                        onPress={() => handleResetQuest(quest.id)}
                      >
                        <Ionicons name="refresh-outline" size={16} color="#A1A1AA" />
                        <Text style={styles.undoButtonText}>Reset</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
            )}
          </>
        )}

        {/* SKIPPED TAB */}
        {activeTab === 'skipped' && (
          <>
            {skippedQuests.length === 0 ? (
              <View style={styles.emptyStateCard}>
                <Ionicons name="ban-outline" size={54} color="#71717A" />
                <Text style={styles.emptyStateTitle}>No Skipped Quests</Text>
                <Text style={styles.emptyStateSubtext}>
                  You haven't skipped any quests today.
                </Text>
              </View>
            ) : (
              skippedQuests.map((quest) => (
                <View key={quest.id} style={styles.questCard}>
                  <View style={styles.questImageWrapper}>
                    <Image source={quest.image} style={[styles.questImage, quest.imageStyle]} />

                    <View style={styles.bottomLeftImageBadge}>
                      <Ionicons name="repeat-outline" size={12} color="#A1A1AA" />
                      <Text style={styles.routineBadgeText}>{quest.type === 'daily' ? 'Routine' : 'Weekly'}</Text>
                    </View>

                    <View style={[styles.xpBadgeTopRight, styles.skippedBadgeContainer]}>
                      <Ionicons name="play-skip-forward" size={14} color="#A1A1AA" />
                      <Text style={[styles.xpBadgeText, { color: '#A1A1AA' }]}>SKIPPED</Text>
                    </View>
                  </View>

                  <View style={styles.questBody}>
                    <View style={styles.questTitleCol}>
                      <View style={styles.categoryPill}>
                        <Text style={styles.categoryPillText}>{quest.category}</Text>
                      </View>
                      <Text style={styles.questTitle}>{quest.title}</Text>
                    </View>

                    <TouchableOpacity
                      style={styles.undoButton}
                      onPress={() => handleResetQuest(quest.id)}
                    >
                      <Ionicons name="refresh-outline" size={16} color="#A1A1AA" />
                      <Text style={styles.undoButtonText}>Reset</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Quest Action Selection Modal (Partial, Skip, Complete) */}
      <QuestActionModal
        visible={actionModalVisible}
        questTitle={selectedQuest?.title ?? ''}
        questCategory={selectedQuest?.category ?? ''}
        xpReward={selectedQuest?.xpReward ?? 0}
        onClose={() => setActionModalVisible(false)}
        onFullComplete={handleFullComplete}
        onPartialComplete={handlePartialComplete}
        onSkip={handleSkip}
      />

      {/* Loot Drop Modal */}
      <LootDropModal visible={dropVisible} rarity={lastDrop} onDismiss={() => setDropVisible(false)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#09090B',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },

  /* Top Header */
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  userProfileGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarWrapper: {
    width: 44,
    height: 44,
    position: 'relative',
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#3F3F46',
  },
  levelBadgeCircle: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#18181B',
    borderWidth: 1.5,
    borderColor: '#3F3F46',
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelBadgeText: {
    fontFamily: fontFamilies.bold,
    fontSize: 9,
    color: '#FFFFFF',
  },
  userTitles: {
    justifyContent: 'center',
  },
  greetingText: {
    fontFamily: fontFamilies.bold,
    fontSize: 18,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  xpSubtext: {
    fontFamily: fontFamilies.bold,
    fontSize: 11,
    color: '#A1A1AA',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#191817',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#8A3B18',
    shadowColor: '#FF5500',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  streakText: {
    fontFamily: fontFamilies.bold,
    fontSize: 15,
    color: '#FFFFFF',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#141418',
    borderWidth: 1,
    borderColor: '#27272A',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Active Campaign */
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitleWide: {
    fontFamily: fontFamilies.bold,
    fontSize: 18,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  dayCounterText: {
    fontFamily: fontFamilies.medium,
    fontSize: 13,
    color: '#A1A1AA',
  },
  campaignCardContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  campaignBgImage: {
    width: '100%',
    height: 180,
  },
  campaignBgStyle: {
    resizeMode: 'cover',
  },
  campaignOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    padding: 16,
    justifyContent: 'space-between',
  },
  campaignTitleContainer: {
    marginTop: 4,
  },
  campaignTitleLine: {
    fontFamily: fontFamilies.bold,
    fontSize: 28,
    color: '#FFFFFF',
    letterSpacing: 2,
    lineHeight: 32,
  },
  campaignDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  campaignDetailLabel: {
    fontFamily: fontFamilies.bold,
    fontSize: 10,
    color: '#A1A1AA',
    letterSpacing: 1.2,
    marginBottom: 3,
  },
  campaignDetailValue: {
    fontFamily: fontFamilies.bold,
    fontSize: 18,
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },

  /* Filter Tabs */
  filterTabsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    gap: 8,
  },
  filterTabActive: {
    backgroundColor: '#E4E4E7',
  },
  filterTabInactive: {
    backgroundColor: '#161618',
    borderWidth: 1,
    borderColor: '#27272A',
  },
  filterTabText: {
    fontFamily: fontFamilies.bold,
    fontSize: 13,
    letterSpacing: 0.8,
  },
  filterTabTextActive: {
    color: '#09090B',
  },
  filterTabTextInactive: {
    color: '#E4E4E7',
  },
  tabBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBadgeActive: {
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  tabBadgeInactive: {
    backgroundColor: '#27272A',
  },
  tabBadgeText: {
    fontFamily: fontFamilies.bold,
    fontSize: 11,
  },
  tabBadgeTextActive: {
    color: '#09090B',
  },
  tabBadgeTextInactive: {
    color: '#A1A1AA',
  },

  /* Main Quests */
  sectionMonoLabel: {
    fontFamily: fontFamilies.bold,
    fontSize: 11,
    color: '#71717A',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  fullImageQuestCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#27272A',
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#121215',
  },
  fullCardImageBg: {
    width: '100%',
    height: 145,
  },
  fullCardImageStyle: {
    resizeMode: 'cover',
  },
  fullCardOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    padding: 14,
    justifyContent: 'space-between',
  },
  fullCardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orangeXpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FF6B00',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  orangeXpBadgeText: {
    fontFamily: fontFamilies.bold,
    fontSize: 12,
    color: '#FFFFFF',
  },
  fullCardBottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  fullCardTextCol: {
    flex: 1,
    paddingRight: 10,
    gap: 4,
  },
  fullCardTitleText: {
    fontFamily: fontFamilies.bold,
    fontSize: 22,
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  fullCardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  fullCardMetaText: {
    fontFamily: fontFamilies.medium,
    fontSize: 13,
    color: '#E4E4E7',
  },
  fullCardMetaDivider: {
    fontFamily: fontFamilies.regular,
    fontSize: 12,
    color: '#71717A',
  }, questCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#27272A',
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#0E0E11',
  },
  questImageWrapper: {
    height: 115,
    position: 'relative',
  },
  questImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  topRightActionsCol: {
    position: 'absolute',
    top: 10,
    right: 10,
    alignItems: 'flex-end',
    gap: 6,
  },
  xpBadgeInline: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  creamSquareTickButton: {
    width: 30,
    height: 30,
    borderRadius: 6,
    backgroundColor: '#E5D7C5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  redSquareWrongButton: {
    width: 30,
    height: 30,
    borderRadius: 6,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  creamSquareTickButtonChecked: {
    backgroundColor: '#22C55E',
  },
  xpBadgeText: {
    fontFamily: fontFamilies.bold,
    fontSize: 13,
    color: '#FFFFFF',
  },
  questBody: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    backgroundColor: '#0E0E11',
  },
  questTitleCol: {
    flex: 1,
    paddingRight: 12,
  },
  bottomLeftImageBadge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'transparent',
  },
  routineBadgeText: {
    fontFamily: fontFamilies.bold,
    fontSize: 10,
    color: '#E4E4E7',
    letterSpacing: 0.5,
  },
  categoryPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#1C1C1E',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#2C2C2E',
    marginBottom: 6,
  },
  categoryPillText: {
    fontFamily: fontFamilies.bold,
    fontSize: 10,
    color: '#A1A1AA',
    letterSpacing: 0.8,
  },
  categoryPillDivider: {
    fontFamily: fontFamilies.regular,
    fontSize: 11,
    color: '#52525B',
  },
  questTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 20,
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  targetValueBox: {
    backgroundColor: '#18181B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#27272A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetValueText: {
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    color: '#FFFFFF',
  },
  questActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  questProgressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressSubtext: {
    fontFamily: fontFamilies.medium,
    fontSize: 12,
    color: '#A1A1AA',
  },
  progressPercentText: {
    fontFamily: fontFamilies.bold,
    fontSize: 12,
    color: '#FFFFFF',
  },
  progressTrack: {
    height: 4,
    backgroundColor: '#27272A',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#E4E4E7',
    borderRadius: 2,
  },

  /* Daily Quests */
  dailyGridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dailyCard: {
    flex: 1,
    backgroundColor: '#121215',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#27272A',
    overflow: 'hidden',
  },
  dailyImageWrapper: {
    height: 140,
  },
  dailyImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  dailyBody: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dailyTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 13,
    color: '#FFFFFF',
    letterSpacing: 0.5,
    flex: 1,
  },
  dailyRewardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dailyRewardText: {
    fontFamily: fontFamilies.medium,
    fontSize: 12,
    color: '#A1A1AA',
  },
  dailyProgressSubtext: {
    fontFamily: fontFamilies.medium,
    fontSize: 10,
    color: '#A1A1AA',
  },
  dailyProgressPercentText: {
    fontFamily: fontFamilies.bold,
    fontSize: 10,
    color: '#FFFFFF',
  },

  /* Empty State Card */
  emptyStateCard: {
    backgroundColor: '#121215',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#27272A',
    paddingVertical: 56,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  emptyStateTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 22,
    color: '#FFFFFF',
    letterSpacing: 0.5,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontFamily: fontFamilies.regular,
    fontSize: 14,
    color: '#A1A1AA',
    textAlign: 'center',
  },

  /* Badges & Reset Actions */
  doneBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderColor: 'rgba(34, 197, 94, 0.4)',
  },
  partialBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderColor: 'rgba(245, 158, 11, 0.4)',
  },
  skippedBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#27272A',
    borderColor: '#3F3F46',
  },
  undoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#18181B',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  undoButtonText: {
    fontFamily: fontFamilies.bold,
    fontSize: 12,
    color: '#A1A1AA',
  },
});
