import { useCallback } from 'react';
import { FlatList } from 'react-native';

import { EmptyState } from '@/components/common/EmptyState';
import { Skeleton } from '@/components/common/Skeleton';
import type { LeaderboardEntry } from '@/services/api/leaderboard.service';

import { LeaderboardRow } from './LeaderboardRow';

type LeaderboardListProps = {
  entries: LeaderboardEntry[];
  isLoading: boolean;
};

export function LeaderboardList({ entries, isLoading }: LeaderboardListProps) {
  const renderItem = useCallback(
    ({ item }: { item: LeaderboardEntry }) => <LeaderboardRow entry={item} />,
    []
  );

  if (isLoading) {
    return (
      <>
        {[0, 1, 2, 3].map((key) => (
          <Skeleton key={key} height={40} />
        ))}
      </>
    );
  }

  if (entries.length === 0) {
    return <EmptyState title="Leaderboard is empty" description="Complete missions to climb the ranks." />;
  }

  return (
    <FlatList
      data={entries}
      keyExtractor={(item) => item.userId}
      renderItem={renderItem}
      initialNumToRender={15}
      windowSize={9}
      removeClippedSubviews
    />
  );
}
