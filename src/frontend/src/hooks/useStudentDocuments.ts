import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { ExtendedDocumentMetadata } from '../backend';

export function useStudentDocuments() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<ExtendedDocumentMetadata[]>({
    queryKey: ['studentDocuments'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listStudentDocuments();
    },
    enabled: !!actor && !!identity && !actorFetching,
  });
}
