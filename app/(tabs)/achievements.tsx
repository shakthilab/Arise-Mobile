import { FlatList, StyleSheet, Text } from 'react-native';

import { Screen } from '@/components/common/Screen';
import { Card } from '@/components/ui/Card';
import { ACHIEVEMENT_DEFINITIONS } from '@/constants/achievements';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export default function AchievementsScreen() {
  return (
    <Screen style={styles.container}>
      <Text style={styles.title}>Achievements</Text>
      <FlatList
        data={ACHIEVEMENT_DEFINITIONS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDescription}>{item.description}</Text>
          </Card>
        )}
      />
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
  list: {
    gap: spacing.sm,
  },
  card: {
    gap: spacing.xxs,
  },
  cardTitle: {
    ...typography.subtitle,
    color: colors.textPrimary,
  },
  cardDescription: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
