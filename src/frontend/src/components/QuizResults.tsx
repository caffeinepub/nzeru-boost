import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Trophy, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizResultsProps {
  correctAnswers: number;
  totalQuestions: number;
  questions: Question[];
  userAnswers: Record<number, number>;
}

export default function QuizResults({
  correctAnswers,
  totalQuestions,
  questions,
  userAnswers,
}: QuizResultsProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const percentage = (correctAnswers / totalQuestions) * 100;
  
  const grade = 
    percentage >= 90 ? 'A' :
    percentage >= 80 ? 'B' :
    percentage >= 70 ? 'C' :
    percentage >= 60 ? 'D' : 'F';

  const feedback =
    percentage >= 90 ? 'Excellent work! 🎉' :
    percentage >= 80 ? 'Great job! 👏' :
    percentage >= 70 ? 'Good effort. Keep practicing! 💪' :
    percentage >= 60 ? 'Study a little more and try again. 📚' :
    'Don\'t give up. Review the material and retake the quiz. 🔄';

  const getGradeColor = () => {
    switch (grade) {
      case 'A':
        return 'from-secondary to-secondary';
      case 'B':
        return 'from-secondary/80 to-secondary';
      case 'C':
        return 'from-muted-foreground to-muted-foreground';
      case 'D':
        return 'from-primary/80 to-primary';
      default:
        return 'from-primary to-primary';
    }
  };

  useEffect(() => {
    if (percentage >= 90) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [percentage]);

  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className="space-y-6">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-6xl animate-bounce-subtle">🎉</div>
        </div>
      )}

      {/* Score Summary Card */}
      <Card className="border-2">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className={cn(
              "h-32 w-32 rounded-full flex items-center justify-center",
              "bg-gradient-to-br shadow-lg",
              getGradeColor()
            )}>
              <div className="text-5xl font-bold text-white">{grade}</div>
            </div>
          </div>
          <CardTitle className="text-3xl">Quiz Complete!</CardTitle>
          <CardDescription className="text-lg">{feedback}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-primary">{correctAnswers}</div>
              <div className="text-xs text-muted-foreground">Correct</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold">{totalQuestions - correctAnswers}</div>
              <div className="text-xs text-muted-foreground">Incorrect</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-secondary">{Math.round(percentage)}%</div>
              <div className="text-xs text-muted-foreground">Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question Review */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Question Review
          </CardTitle>
          <CardDescription>Review your answers and learn from mistakes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {questions.map((question, index) => {
            const userAnswer = userAnswers[index];
            const isCorrect = userAnswer === question.correctAnswer;

            return (
              <div
                key={question.id}
                className={cn(
                  "p-4 rounded-lg border-2 transition-colors",
                  isCorrect ? "border-secondary/30 bg-secondary/5" : "border-primary/30 bg-primary/5"
                )}
              >
                <div className="flex items-start gap-3 mb-3">
                  {isCorrect ? (
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium mb-2">
                      Question {index + 1}: {question.question}
                    </p>
                    <div className="space-y-2">
                      {question.options.map((option, optIndex) => {
                        const isUserAnswer = userAnswer === optIndex;
                        const isCorrectAnswer = question.correctAnswer === optIndex;

                        return (
                          <div
                            key={optIndex}
                            className={cn(
                              "p-2 rounded text-sm",
                              isCorrectAnswer && "bg-secondary/20 font-medium",
                              isUserAnswer && !isCorrect && "bg-primary/20"
                            )}
                          >
                            <span className="font-medium">{optionLabels[optIndex]}.</span> {option}
                            {isCorrectAnswer && " ✓"}
                            {isUserAnswer && !isCorrect && " ✗"}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
