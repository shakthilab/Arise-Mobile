import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/common/Screen';
import { MissionList } from '@/components/features/missions/MissionList';
import { StreakBadge } from '@/components/features/streaks/StreakBadge';
import { LootDropModal } from '@/components/features/loot/LootDropModal';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useAuth } from '@/hooks/useAuth';
import { useLootDrop } from '@/hooks/useLootDrop';
import { useMissions } from '@/hooks/useMissions';
import { useStreak } from '@/hooks/useStreak';
import { useXP } from '@/hooks/useXP';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export default function MissionsScreen() {
  const { user } = useAuth();
  const { missions, isLoading, complete } = useMissions();
  const xpProgress = useXP(user?.xp ?? 0);
  const streak = useStreak(user?.currentStreak ?? 0, null);
  const { lastDrop, roll } = useLootDrop();
  const [dropVisible, setDropVisible] = useState(false);

  const handleComplete = async (missionId: string) => {
    await complete(missionId);
    roll();
    setDropVisible(true);
  };

  return (
    <Screen style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back{user ? `, ${user.displayName}` : ''}</Text>
          <Text style={styles.level}>Level {xpProgress.level}</Text>
        </View>
        <StreakBadge days={streak.count} isAtRisk={streak.isAtRisk} />
      </View>

      <ProgressBar progress={xpProgress.progress} />
      <Text style={styles.xpLabel}>
        {xpProgress.xpIntoLevel} / {xpProgress.xpIntoLevel + xpProgress.xpToNextLevel} XP
      </Text>

      <Text style={styles.sectionTitle}>Today&apos;s Missions</Text>
      <MissionList missions={missions} isLoading={isLoading} onComplete={handleComplete} />

      <LootDropModal visible={dropVisible} rarity={lastDrop} onDismiss={() => setDropVisible(false)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    ...typography.body,
    color: colors.textSecondary,
  },
  level: {
    ...typography.title,
    color: colors.textPrimary,
  },
  xpLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.textPrimary,
    marginTop: spacing.md,
  },
});
