import { useCallback, useEffect, useState } from 'react';

import * as missionsService from '@/services/api/missions.service';
import type { Mission } from '@/types/mission';

export function useMissions() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setMissions(await missionsService.fetchMissions());
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load missions'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const complete = useCallback(async (missionId: string) => {
    const updated = await missionsService.completeMission(missionId);
    setMissions((current) => current.map((m) => (m.id === missionId ? updated : m)));
  }, []);

  return { missions, isLoading, error, refetch: load, complete };
}
