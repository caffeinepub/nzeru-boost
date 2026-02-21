import { useStudentDashboard } from '../hooks/useStudentDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Trophy, TrendingUp, Target } from 'lucide-react';

export default function DashboardStats() {
  const { data: dashboard, isLoading } = useStudentDashboard();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quizzes Taken</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Start your first quiz!</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const bestScorePercentage = dashboard.bestScore?.percentage || 0;
  const averagePercentage = dashboard.averagePercentage || 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-2 hover:border-primary/50 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Quizzes Taken</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{Number(dashboard.quizzesTaken)}</div>
          <p className="text-xs text-muted-foreground">Total attempts</p>
        </CardContent>
      </Card>

      <Card className="border-2 hover:border-primary/50 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Best Score</CardTitle>
          <Trophy className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{Math.round(bestScorePercentage)}%</div>
          <p className="text-xs text-muted-foreground">
            {dashboard.bestScore?.grade || 'N/A'} grade
          </p>
        </CardContent>
      </Card>

      <Card className="border-2 hover:border-primary/50 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          <TrendingUp className="h-4 w-4 text-secondary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{Math.round(averagePercentage)}%</div>
          <p className="text-xs text-muted-foreground">Across all quizzes</p>
        </CardContent>
      </Card>

      <Card className="border-2 hover:border-primary/50 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Progress</CardTitle>
          <Target className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {dashboard.quizzesTaken > BigInt(0) ? '📈' : '🎯'}
          </div>
          <p className="text-xs text-muted-foreground">
            {dashboard.quizzesTaken > BigInt(0) ? 'Keep it up!' : 'Start learning'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
