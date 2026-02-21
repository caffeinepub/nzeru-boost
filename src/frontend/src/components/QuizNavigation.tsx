import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ChevronLeft, ChevronRight, Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuizNavigationProps {
  currentQuestion: number;
  totalQuestions: number;
  answeredQuestions: number[];
  onPrevious: () => void;
  onNext: () => void;
  onGoToQuestion: (index: number) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export default function QuizNavigation({
  currentQuestion,
  totalQuestions,
  answeredQuestions,
  onPrevious,
  onNext,
  onGoToQuestion,
  onSubmit,
  isSubmitting,
}: QuizNavigationProps) {
  const isFirstQuestion = currentQuestion === 0;
  const isLastQuestion = currentQuestion === totalQuestions - 1;
  const allAnswered = answeredQuestions.length === totalQuestions;

  return (
    <div className="space-y-4">
      {/* Question Progress Indicators */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">
              Progress: {answeredQuestions.length}/{totalQuestions} answered
            </p>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {Array.from({ length: totalQuestions }, (_, i) => (
                <button
                  key={i}
                  onClick={() => onGoToQuestion(i)}
                  className={cn(
                    'aspect-square rounded-lg text-sm font-medium transition-all',
                    'hover:scale-110',
                    currentQuestion === i
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : answeredQuestions.includes(i)
                      ? 'bg-green-500/20 text-green-700 dark:text-green-400 border border-green-500/30'
                      : 'bg-muted text-muted-foreground border border-border'
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={isFirstQuestion || isSubmitting}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        <div className="flex gap-3">
          {!isLastQuestion ? (
            <Button onClick={onNext} disabled={isSubmitting} className="gap-2 flex-1 sm:flex-none">
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button disabled={isSubmitting} className="gap-2 flex-1 sm:flex-none">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Submit Quiz
                    </>
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Submit Quiz?</AlertDialogTitle>
                  <AlertDialogDescription>
                    {allAnswered ? (
                      'You have answered all questions. Are you ready to submit your quiz?'
                    ) : (
                      <>
                        You have answered {answeredQuestions.length} out of {totalQuestions} questions.
                        Unanswered questions will be marked as incorrect. Are you sure you want to submit?
                      </>
                    )}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Review Answers</AlertDialogCancel>
                  <AlertDialogAction onClick={onSubmit}>
                    Submit Quiz
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </div>
  );
}
