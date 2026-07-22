import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import type { LootRarity } from '@/types/mission';

type BadgeProps = {
  label: string;
  rarity?: LootRarity;
};

export function Badge({ label, rarity = 'common' }: BadgeProps) {
  const tint = colors.rarity[rarity];

  return (
    <View style={[styles.badge, { borderColor: tint }]}>
      <Text style={[styles.label, { color: tint }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.xxs,
    paddingHorizontal: spacing.xs,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  label: {
    ...typography.label,
    textTransform: 'uppercase',
  },
});
