import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useGetCallerUserProfile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, BookOpen, Trophy, ArrowRight, Sparkles } from 'lucide-react';
import { useEffect } from 'react';

export default function HomePage() {
  const navigate = useNavigate();
  const { identity, login, loginStatus } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;

  useEffect(() => {
    if (isAuthenticated && userProfile && !profileLoading) {
      navigate({ to: '/dashboard' });
    }
  }, [isAuthenticated, userProfile, profileLoading, navigate]);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate({ to: '/dashboard' });
    } else {
      login();
    }
  };

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          <Sparkles className="h-4 w-4" />
          AI-Powered Learning Platform
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent">
          Boost Your Knowledge
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
          Upload your study materials and get instant AI-generated quizzes. Learn smarter, not harder.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button size="lg" onClick={handleGetStarted} className="gap-2 text-lg px-8" disabled={loginStatus === 'logging-in'}>
            Get Started Free
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
        <div className="pt-8">
          <img
            src="/assets/generated/hero-students.dim_1200x600.png"
            alt="Students learning with digital devices"
            className="rounded-2xl shadow-2xl mx-auto max-w-4xl w-full border border-border/50"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
          <p className="text-muted-foreground text-lg">Three simple steps to supercharge your learning</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center mb-4">
                <img src="/assets/generated/upload-icon.dim_128x128.png" alt="Upload" className="h-10 w-10" />
              </div>
              <CardTitle>1. Upload Documents</CardTitle>
              <CardDescription>
                Upload your textbooks, notes, or any study material in PDF or document format
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
                <img src="/assets/generated/quiz-icon.dim_128x128.png" alt="Quiz" className="h-10 w-10" />
              </div>
              <CardTitle>2. Take AI Quizzes</CardTitle>
              <CardDescription>
                Our AI generates custom quizzes based on your uploaded content to test your knowledge
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center mb-4">
                <img src="/assets/generated/trophy-icon.dim_128x128.png" alt="Trophy" className="h-10 w-10" />
              </div>
              <CardTitle>3. Track Progress</CardTitle>
              <CardDescription>
                Monitor your scores, see your improvement, and identify areas that need more focus
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-6 py-12">
        <Card className="max-w-3xl mx-auto bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5 border-2">
          <CardHeader className="space-y-4">
            <CardTitle className="text-3xl">Ready to Transform Your Learning?</CardTitle>
            <CardDescription className="text-lg">
              Join students who are already boosting their knowledge with AI-powered quizzes
            </CardDescription>
            <Button size="lg" onClick={handleGetStarted} className="gap-2 text-lg" disabled={loginStatus === 'logging-in'}>
              Start Learning Now
              <ArrowRight className="h-5 w-5" />
            </Button>
          </CardHeader>
        </Card>
      </section>
    </div>
  );
}
