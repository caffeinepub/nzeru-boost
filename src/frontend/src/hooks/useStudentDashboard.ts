import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { StudentProgress } from '../backend';

export function useStudentDashboard() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<StudentProgress>({
    queryKey: ['studentDashboard'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getStudentDashboard();
    },
    enabled: !!actor && !!identity && !actorFetching,
    retry: false,
  });
}
