import { useCallback, useEffect, useState } from 'react';

import { fetchLeaderboard, type LeaderboardEntry } from '@/services/api/leaderboard.service';

export function useLeaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setEntries(await fetchLeaderboard());
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load leaderboard'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { entries, isLoading, error, refetch: load };
}
