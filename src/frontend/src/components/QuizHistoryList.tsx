import { useStudentDashboard } from '../hooks/useStudentDashboard';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, RotateCcw, Trophy } from 'lucide-react';
import { format } from 'date-fns';

export default function QuizHistoryList() {
  const { data: dashboard, isLoading } = useStudentDashboard();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quiz History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-10 w-24" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!dashboard || dashboard.quizHistory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quiz History</CardTitle>
          <CardDescription>Your quiz attempts will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No quizzes taken yet. Upload a document and take your first quiz!</p>
            <Button onClick={() => navigate({ to: '/documents' })} className="mt-4">
              Get Started
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A':
        return 'bg-secondary/20 text-secondary-foreground border-secondary/30';
      case 'B':
        return 'bg-secondary/15 text-secondary-foreground border-secondary/25';
      case 'C':
        return 'bg-muted text-muted-foreground border-border';
      case 'D':
        return 'bg-primary/15 text-primary-foreground border-primary/25';
      default:
        return 'bg-primary/20 text-primary-foreground border-primary/30';
    }
  };

  const sortedHistory = [...dashboard.quizHistory].sort((a, b) => 
    Number(b.timestamp) - Number(a.timestamp)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quiz History</CardTitle>
        <CardDescription>
          {dashboard.quizHistory.length} {dashboard.quizHistory.length === 1 ? 'quiz' : 'quizzes'} completed
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {sortedHistory.map((quiz, index) => (
          <div
            key={quiz.quizId}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border rounded-lg hover:border-primary/50 transition-colors"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <Badge className={getGradeColor(quiz.grade)}>
                  Grade: {quiz.grade}
                </Badge>
                <span className="text-sm font-medium">
                  {Number(quiz.correctAnswers)}/{Number(quiz.totalQuestions)} correct
                </span>
                <span className="text-sm text-muted-foreground">
                  ({Math.round(quiz.percentage)}%)
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>
                  {format(new Date(Number(quiz.timestamp) / 1000000), 'MMM d, yyyy h:mm a')}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{quiz.feedback}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
