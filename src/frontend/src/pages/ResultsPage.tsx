import { useParams, useNavigate, useRouterState } from '@tanstack/react-router';
import AuthGuard from '../components/AuthGuard';
import QuizResults from '../components/QuizResults';
import { Button } from '@/components/ui/button';
import { RotateCcw, Home } from 'lucide-react';

export default function ResultsPage() {
  const { quizId } = useParams({ strict: false });
  const navigate = useNavigate();
  const routerState = useRouterState();
  const state = routerState.location.state as any;

  if (!state || !state.correctAnswers) {
    return (
      <AuthGuard>
        <div className="text-center py-12 space-y-4">
          <p className="text-muted-foreground">No quiz results found</p>
          <Button onClick={() => navigate({ to: '/dashboard' })}>
            Go to Dashboard
          </Button>
        </div>
      </AuthGuard>
    );
  }

  const { correctAnswers, totalQuestions, questions, answers } = state;

  return (
    <AuthGuard>
      <div className="max-w-4xl mx-auto space-y-6">
        <QuizResults
          correctAnswers={correctAnswers}
          totalQuestions={totalQuestions}
          questions={questions}
          userAnswers={answers}
        />

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" onClick={() => navigate({ to: '/dashboard' })} className="gap-2">
            <Home className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <Button onClick={() => navigate({ to: '/documents' })} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Take Another Quiz
          </Button>
        </div>
      </div>
    </AuthGuard>
  );
}
