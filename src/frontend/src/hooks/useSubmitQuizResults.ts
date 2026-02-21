import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

interface SubmitQuizResultsParams {
  quizId: string;
  correctAnswers: bigint;
  totalQuestions: bigint;
}

export function useSubmitQuizResults() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ quizId, correctAnswers, totalQuestions }: SubmitQuizResultsParams) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitQuizResults(quizId, correctAnswers, totalQuestions);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studentDashboard'] });
    },
  });
}
