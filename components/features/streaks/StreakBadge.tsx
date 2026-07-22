import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { formatStreak } from '@/utils/formatters';

type StreakBadgeProps = {
  days: number;
  isAtRisk?: boolean;
};

export function StreakBadge({ days, isAtRisk }: StreakBadgeProps) {
  return (
    <View style={[styles.container, isAtRisk && styles.atRisk]}>
      <Text style={styles.icon}>🔥</Text>
      <Text style={styles.text}>{formatStreak(days)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    paddingVertical: spacing.xxs,
    paddingHorizontal: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceElevated,
  },
  atRisk: {
    borderWidth: 1,
    borderColor: colors.danger,
  },
  icon: {
    fontSize: 14,
  },
  text: {
    ...typography.label,
    color: colors.textPrimary,
  },
});
