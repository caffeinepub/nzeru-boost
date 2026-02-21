import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import AuthGuard from '../components/AuthGuard';
import QuizQuestion from '../components/QuizQuestion';
import QuizNavigation from '../components/QuizNavigation';
import { useQuizState } from '../hooks/useQuizState';
import { useSubmitQuizResults } from '../hooks/useSubmitQuizResults';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// Mock quiz data - in a real app, this would be generated from the document
const generateMockQuiz = (documentId: string) => {
  return {
    documentId,
    questions: [
      {
        id: '1',
        question: 'What is the law of demand in economics?',
        options: [
          'When price increases, demand decreases',
          'When price decreases, demand increases',
          'Price and demand are unrelated',
          'Supply determines demand'
        ],
        correctAnswer: 0
      },
      {
        id: '2',
        question: 'What is market equilibrium?',
        options: [
          'When supply equals demand',
          'When prices are at their highest',
          'When there is no competition',
          'When government controls prices'
        ],
        correctAnswer: 0
      },
      {
        id: '3',
        question: 'What causes a shift in the supply curve?',
        options: [
          'Change in consumer preferences',
          'Change in production costs',
          'Change in consumer income',
          'Change in population'
        ],
        correctAnswer: 1
      },
      {
        id: '4',
        question: 'What is price elasticity of demand?',
        options: [
          'How much quantity demanded changes when price changes',
          'How much price changes when supply changes',
          'The total revenue from sales',
          'The cost of production'
        ],
        correctAnswer: 0
      },
      {
        id: '5',
        question: 'What characterizes perfect competition?',
        options: [
          'One seller controls the market',
          'Few sellers with similar products',
          'Many sellers with identical products',
          'Government-regulated prices'
        ],
        correctAnswer: 2
      },
      {
        id: '6',
        question: 'What is a monopoly?',
        options: [
          'Many sellers competing',
          'Two sellers dominating',
          'One seller controlling the market',
          'Government ownership'
        ],
        correctAnswer: 2
      },
      {
        id: '7',
        question: 'What is consumer surplus?',
        options: [
          'Extra money consumers save',
          'Difference between what consumers pay and what they are willing to pay',
          'Total spending by consumers',
          'Government subsidies'
        ],
        correctAnswer: 1
      },
      {
        id: '8',
        question: 'What is opportunity cost?',
        options: [
          'The price of a product',
          'The cost of production',
          'The value of the next best alternative foregone',
          'The total cost of all options'
        ],
        correctAnswer: 2
      },
      {
        id: '9',
        question: 'What is inflation?',
        options: [
          'Decrease in prices over time',
          'Increase in prices over time',
          'Stable prices',
          'Government price controls'
        ],
        correctAnswer: 1
      },
      {
        id: '10',
        question: 'What is GDP?',
        options: [
          'Government Debt Product',
          'Gross Domestic Product',
          'General Development Plan',
          'Global Distribution Process'
        ],
        correctAnswer: 1
      }
    ]
  };
};

interface QuizResultsState {
  correctAnswers: number;
  totalQuestions: number;
  questions: Array<{
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
  }>;
  answers: Record<number, number>;
}

export default function QuizPage() {
  const { documentId } = useParams({ strict: false });
  const navigate = useNavigate();
  const submitResults = useSubmitQuizResults();

  const quiz = generateMockQuiz(documentId || 'default');
  const {
    currentQuestionIndex,
    answers,
    goToNext,
    goToPrevious,
    goToQuestion,
    selectAnswer,
    isAnswered
  } = useQuizState(quiz.questions.length);

  const currentQuestion = quiz.questions[currentQuestionIndex];

  const handleSubmit = async () => {
    const correctAnswers = quiz.questions.filter(
      (q, idx) => answers[idx] === q.correctAnswer
    ).length;

    const quizId = `quiz-${documentId}-${Date.now()}`;

    try {
      await submitResults.mutateAsync({
        quizId,
        correctAnswers: BigInt(correctAnswers),
        totalQuestions: BigInt(quiz.questions.length)
      });

      toast.success('Quiz submitted successfully!');
      
      // Navigate with results data
      const resultsState: QuizResultsState = {
        correctAnswers,
        totalQuestions: quiz.questions.length,
        questions: quiz.questions,
        answers
      };

      navigate({ 
        to: '/results/$quizId', 
        params: { quizId },
        // @ts-ignore - TanStack Router state typing issue
        state: resultsState
      });
    } catch (error) {
      toast.error('Failed to submit quiz. Please try again.');
      console.error('Quiz submission error:', error);
    }
  };

  if (!documentId) {
    return (
      <AuthGuard>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Invalid quiz</p>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="p-6 md:p-8">
          <QuizQuestion
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={quiz.questions.length}
            selectedAnswer={answers[currentQuestionIndex]}
            onSelectAnswer={(answer) => selectAnswer(currentQuestionIndex, answer)}
          />
        </Card>

        <QuizNavigation
          currentQuestion={currentQuestionIndex}
          totalQuestions={quiz.questions.length}
          answeredQuestions={Object.keys(answers).map(Number)}
          onPrevious={goToPrevious}
          onNext={goToNext}
          onGoToQuestion={goToQuestion}
          onSubmit={handleSubmit}
          isSubmitting={submitResults.isPending}
        />
      </div>
    </AuthGuard>
  );
}
