import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { formatXp } from '@/utils/formatters';
import type { LeaderboardEntry } from '@/services/api/leaderboard.service';

function LeaderboardRowComponent({ entry }: { entry: LeaderboardEntry }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rank}>#{entry.rank}</Text>
      <Text style={styles.name} numberOfLines={1}>
        {entry.displayName}
      </Text>
      <Text style={styles.level}>Lv.{entry.level}</Text>
      <Text style={styles.xp}>{formatXp(entry.xp)} XP</Text>
    </View>
  );
}

export const LeaderboardRow = memo(LeaderboardRowComponent);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rank: {
    ...typography.subtitle,
    color: colors.textSecondary,
    width: 32,
  },
  name: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
  },
  level: {
    ...typography.caption,
    color: colors.accentSecondary,
  },
  xp: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
