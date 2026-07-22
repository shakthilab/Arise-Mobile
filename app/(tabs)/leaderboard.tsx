import { StyleSheet, Text } from 'react-native';

import { Screen } from '@/components/common/Screen';
import { LeaderboardList } from '@/components/features/leaderboard/LeaderboardList';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export default function LeaderboardScreen() {
  const { entries, isLoading } = useLeaderboard();

  return (
    <Screen style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>
      <LeaderboardList entries={entries} isLoading={isLoading} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
  },
});
