import { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useActor } from '../hooks/useActor';
import AuthGuard from '../components/AuthGuard';
import QuizQuestion from '../components/QuizQuestion';
import QuizNavigation from '../components/QuizNavigation';
import { useQuizState } from '../hooks/useQuizState';
import { useSubmitQuizResults } from '../hooks/useSubmitQuizResults';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';
import type { ExtendedDocumentMetadata } from '../backend';

// Generate mock quiz questions based on examination board format
const generateMockQuiz = (documentId: string, examinationBoard?: string) => {
  // ABMA EXAMINATION format questions
  const abmaQuestions = [
    {
      id: '1',
      question: 'Explain the concept of demand in economic theory. Which statement best describes the law of demand?',
      options: [
        'As price increases, quantity demanded decreases, ceteris paribus',
        'As price decreases, quantity demanded increases proportionally',
        'Price and demand maintain an inverse relationship in all market conditions',
        'Supply determines the level of demand in competitive markets'
      ],
      correctAnswer: 0
    },
    {
      id: '2',
      question: 'Define market equilibrium and identify the condition that must be satisfied.',
      options: [
        'The point where quantity supplied equals quantity demanded at a given price',
        'The situation where market prices reach their maximum sustainable level',
        'The absence of competitive forces in the marketplace',
        'The condition where government intervention stabilizes prices'
      ],
      correctAnswer: 0
    },
    {
      id: '3',
      question: 'Analyze the factors that cause a shift in the supply curve. Which factor directly affects supply?',
      options: [
        'Changes in consumer preferences and tastes',
        'Changes in production costs and technology',
        'Changes in consumer income levels',
        'Changes in population demographics'
      ],
      correctAnswer: 1
    },
    {
      id: '4',
      question: 'Evaluate the concept of price elasticity of demand. What does this measure indicate?',
      options: [
        'The responsiveness of quantity demanded to changes in price',
        'The responsiveness of price to changes in supply conditions',
        'The total revenue generated from product sales',
        'The marginal cost of production per unit'
      ],
      correctAnswer: 0
    },
    {
      id: '5',
      question: 'Describe the characteristics of perfect competition. Which feature is essential?',
      options: [
        'A single seller controls the entire market supply',
        'A small number of sellers offer similar but differentiated products',
        'Many sellers offer homogeneous products with free market entry',
        'Government regulation determines market prices and quantities'
      ],
      correctAnswer: 2
    },
    {
      id: '6',
      question: 'Define monopoly market structure. What distinguishes a monopoly from other market forms?',
      options: [
        'Multiple firms competing with similar products',
        'Two dominant firms controlling market share',
        'A single firm with significant market power and barriers to entry',
        'Government ownership of production facilities'
      ],
      correctAnswer: 2
    },
    {
      id: '7',
      question: 'Explain consumer surplus in economic terms. How is it calculated?',
      options: [
        'The total amount of money consumers save through discounts',
        'The difference between willingness to pay and actual price paid',
        'The aggregate expenditure by all consumers in the market',
        'The value of government subsidies provided to consumers'
      ],
      correctAnswer: 1
    },
    {
      id: '8',
      question: 'Analyze the concept of opportunity cost. What does this principle represent?',
      options: [
        'The monetary price of a product or service',
        'The total cost of production including fixed costs',
        'The value of the next best alternative foregone when making a choice',
        'The cumulative cost of all available alternatives'
      ],
      correctAnswer: 2
    },
    {
      id: '9',
      question: 'Define inflation and its impact on the economy. What characterizes inflation?',
      options: [
        'A sustained decrease in the general price level over time',
        'A sustained increase in the general price level over time',
        'A period of stable prices with no fluctuations',
        'Government-imposed controls on price movements'
      ],
      correctAnswer: 1
    },
    {
      id: '10',
      question: 'Explain Gross Domestic Product (GDP). What does GDP measure?',
      options: [
        'Government Debt Product - total national debt',
        'Gross Domestic Product - total value of goods and services produced',
        'General Development Plan - economic development strategy',
        'Global Distribution Process - international trade flows'
      ],
      correctAnswer: 1
    }
  ];

  // General format questions (default)
  const generalQuestions = [
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
  ];

  // Select questions based on examination board
  const questions = examinationBoard === 'ABMA' ? abmaQuestions : generalQuestions;

  return {
    documentId,
    examinationBoard,
    questions
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
  const { actor } = useActor();

  // Fetch document metadata to get examination board
  const { data: documentMetadata, isLoading: isLoadingMetadata } = useQuery<ExtendedDocumentMetadata>({
    queryKey: ['documentMetadata', documentId],
    queryFn: async () => {
      if (!actor || !documentId) throw new Error('Actor or documentId not available');
      return actor.getDocumentMetadata(documentId);
    },
    enabled: !!actor && !!documentId,
  });

  const quiz = generateMockQuiz(documentId || 'default', documentMetadata?.examinationBoard);
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

  if (isLoadingMetadata) {
    return (
      <AuthGuard>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Examination Board Indicator */}
        {documentMetadata?.examinationBoard && (
          <Card className="p-4 bg-accent/30 border-accent">
            <div className="flex items-center gap-2 text-sm">
              <GraduationCap className="h-5 w-5 text-accent-foreground" />
              <span className="font-medium">Examination Board Format:</span>
              <Badge variant="outline" className="bg-accent text-accent-foreground border-accent">
                {documentMetadata.examinationBoard}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Questions are tailored to {documentMetadata.examinationBoard} examination format and style
            </p>
          </Card>
        )}

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
