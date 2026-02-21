import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useGetCallerUserProfile';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import DocumentsPage from './pages/DocumentsPage';
import QuizPage from './pages/QuizPage';
import ResultsPage from './pages/ResultsPage';
import Layout from './components/Layout';
import ProfileSetup from './components/ProfileSetup';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Layout>
        <Outlet />
      </Layout>
      <ProfileSetup />
    </>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardPage,
});

const documentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/documents',
  component: DocumentsPage,
});

const quizRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/quiz/$documentId',
  component: QuizPage,
});

const resultsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/results/$quizId',
  component: ResultsPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  documentsRoute,
  quizRoute,
  resultsRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
