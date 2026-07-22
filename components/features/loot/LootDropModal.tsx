import { Modal, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/common/Button';
import { Badge } from '@/components/ui/Badge';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import type { LootRarity } from '@/types/mission';

type LootDropModalProps = {
  visible: boolean;
  rarity: LootRarity | null;
  onDismiss: () => void;
};

/**
 * Renders a static reveal for now. Swap the placeholder box for a Lottie
 * rarity-tier animation once Sunil delivers the assets.
 */
export function LootDropModal({ visible, rarity, onDismiss }: LootDropModalProps) {
  if (!rarity) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>Loot Drop!</Text>
          <Badge label={rarity} rarity={rarity} />
          <Button label="Continue" onPress={onDismiss} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(5, 7, 12, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
    width: '80%',
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
  },
});
