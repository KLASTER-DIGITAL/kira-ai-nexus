
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from './context/auth';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import {
  HomePage,
  DashboardPage,
  NotesPage,
  GraphViewPage,
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

import { ProtectedRoute } from '@/components/features/auth';

function App() {
  const { toast } = useToast();
  
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/index" element={<Index />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        
        {/* Main dashboard routes */}
        <Route path="/dashboard" element={<Navigate to="/dashboard/user" replace />} />
        <Route
          path="/dashboard/user"
          element={
            <ProtectedRoute>
              <UserDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute requiredRole="superadmin">
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        
        {/* Feature pages */}
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
            <ProtectedRoute requiredRole="superadmin">
              <AISettingsPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
