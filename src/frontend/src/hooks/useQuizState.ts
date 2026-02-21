import { useState, useCallback } from 'react';

export function useQuizState(totalQuestions: number) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const goToNext = useCallback(() => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  }, [currentQuestionIndex, totalQuestions]);

  const goToPrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  }, [currentQuestionIndex]);

  const goToQuestion = useCallback((index: number) => {
    if (index >= 0 && index < totalQuestions) {
      setCurrentQuestionIndex(index);
    }
  }, [totalQuestions]);

  const selectAnswer = useCallback((questionIndex: number, answer: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answer,
    }));
  }, []);

  const isAnswered = useCallback((questionIndex: number) => {
    return answers[questionIndex] !== undefined;
  }, [answers]);

  return {
    currentQuestionIndex,
    answers,
    goToNext,
    goToPrevious,
    goToQuestion,
    selectAnswer,
    isAnswered,
  };
}
