import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import { useAuth } from './context/auth';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import {
  HomePage,
  DashboardPage,
  NotesPage,
  GraphViewPage, // Add GraphViewPage import
  NotesGraphPage,
  TasksPage,
  CalendarPage,
  ChatPage,
  AuthPage,
  ResetPasswordPage,
  HelpPage,
  AISettingsPage,
  AdminDashboardPage,
  UserDashboardPage,
  NotFound,
  Index,
  LandingPage
} from './pages';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [hasShownToast, setHasShownToast] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !hasShownToast) {
      toast({
        title: "Требуется авторизация",
        description: "Пожалуйста, войдите или зарегистрируйтесь, чтобы получить доступ к этой странице.",
      });
      setHasShownToast(true);
    }
  }, [isAuthenticated, isLoading, toast, hasShownToast]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/auth" replace />
  );
};

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/index" element={<Index />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user"
            element={
              <ProtectedRoute>
                <UserDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notes"
            element={
              <ProtectedRoute>
                <NotesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notes-graph"
            element={
              <ProtectedRoute>
                <NotesGraphPage />
              </ProtectedRoute>
            }
          />
          {
            // In the router section, add the GraphViewPage route:
          }
          <Route
            path="/graph"
            element={
              <ProtectedRoute>
                <GraphViewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <TasksPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <CalendarPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />
          <Route path="/help" element={<HelpPage />} />
          <Route
            path="/ai-settings"
            element={
              <ProtectedRoute>
                <AISettingsPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </>
  );
}

export default App;
