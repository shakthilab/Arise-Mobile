import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import type { Mission } from '@/types/mission';

type MissionCardProps = {
  mission: Mission;
  onComplete: (missionId: string) => void;
};

function MissionCardComponent({ mission, onComplete }: MissionCardProps) {
  const isCompleted = mission.status === 'completed';

  return (
    <Card style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.title}>{mission.title}</Text>
        <Text style={styles.description}>{mission.description}</Text>
        <Text style={styles.xp}>+{mission.xpReward} XP</Text>
      </View>
      <Pressable
        disabled={isCompleted}
        onPress={() => onComplete(mission.id)}
        style={[styles.checkbox, isCompleted && styles.checkboxDone]}
      >
        {isCompleted ? <Text style={styles.checkmark}>✓</Text> : null}
      </Pressable>
    </Card>
  );
}

export const MissionCard = memo(MissionCardComponent);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  info: {
    flex: 1,
    gap: spacing.xxs,
  },
  title: {
    ...typography.subtitle,
    color: colors.textPrimary,
  },
  description: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  xp: {
    ...typography.label,
    color: colors.accentPrimary,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.accentPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: {
    backgroundColor: colors.accentPrimary,
  },
  checkmark: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
});
