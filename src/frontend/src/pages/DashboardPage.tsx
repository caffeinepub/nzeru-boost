import AuthGuard from '../components/AuthGuard';
import DashboardStats from '../components/DashboardStats';
import QuizHistoryList from '../components/QuizHistoryList';
import { useGetCallerUserProfile } from '../hooks/useGetCallerUserProfile';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { Upload, BookOpen } from 'lucide-react';

export default function DashboardPage() {
  const { data: userProfile } = useGetCallerUserProfile();
  const navigate = useNavigate();

  return (
    <AuthGuard>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              Welcome back, {userProfile?.name || 'Student'}! 👋
            </h1>
            <p className="text-muted-foreground mt-2">
              Track your progress and continue your learning journey
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => navigate({ to: '/documents' })} variant="outline" className="gap-2">
              <BookOpen className="h-4 w-4" />
              My Documents
            </Button>
            <Button onClick={() => navigate({ to: '/documents' })} className="gap-2">
              <Upload className="h-4 w-4" />
              Upload New
            </Button>
          </div>
        </div>

        {/* Stats */}
        <DashboardStats />

        {/* Quiz History */}
        <QuizHistoryList />
      </div>
    </AuthGuard>
  );
}
