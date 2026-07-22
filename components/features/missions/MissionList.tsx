import { useCallback } from 'react';
import { FlatList, StyleSheet } from 'react-native';

import { EmptyState } from '@/components/common/EmptyState';
import { Skeleton } from '@/components/common/Skeleton';
import { spacing } from '@/theme/spacing';
import type { Mission } from '@/types/mission';

import { MissionCard } from './MissionCard';

type MissionListProps = {
  missions: Mission[];
  isLoading: boolean;
  onComplete: (missionId: string) => void;
};

export function MissionList({ missions, isLoading, onComplete }: MissionListProps) {
  const renderItem = useCallback(
    ({ item }: { item: Mission }) => <MissionCard mission={item} onComplete={onComplete} />,
    [onComplete]
  );

  if (isLoading) {
    return (
      <>
        {[0, 1, 2].map((key) => (
          <Skeleton key={key} height={72} borderRadius={12} />
        ))}
      </>
    );
  }

  if (missions.length === 0) {
    return <EmptyState title="No missions yet" description="Check back tomorrow for new quests." />;
  }

  return (
    <FlatList
      data={missions}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.content}
      initialNumToRender={10}
      windowSize={7}
      removeClippedSubviews
    />
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.sm,
    paddingBottom: spacing.lg,
  },
});
