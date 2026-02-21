import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizQuestionProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer?: number;
  onSelectAnswer: (answer: number) => void;
}

export default function QuizQuestion({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer,
}: QuizQuestionProps) {
  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="text-sm">
          Question {questionNumber} of {totalQuestions}
        </Badge>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl md:text-2xl font-semibold leading-relaxed">
          {question.question}
        </h2>

        <div className="space-y-3 pt-4">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => onSelectAnswer(index)}
              className={cn(
                'w-full text-left p-4 rounded-lg border-2 transition-all',
                'hover:border-primary/50 hover:bg-accent/50',
                selectedAnswer === index
                  ? 'border-primary bg-primary/10 shadow-sm'
                  : 'border-border'
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    'flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center font-semibold text-sm',
                    selectedAnswer === index
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {optionLabels[index]}
                </div>
                <p className="flex-1 pt-1">{option}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
