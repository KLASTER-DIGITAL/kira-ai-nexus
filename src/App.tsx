
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from './context/auth';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';

// Layouts
import AppLayout from '@/components/layout/AppLayout';

// Pages
import {
  HomePage,
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
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/index" element={<Index />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        
        {/* Protected routes with AppLayout */}
        <Route element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }>
          {/* Dashboard routes */}
          <Route path="/dashboard" element={<Navigate to="/dashboard/user" replace />} />
          <Route path="/dashboard/user" element={<UserDashboardPage />} />
          <Route path="/dashboard/admin" element={
            <ProtectedRoute requiredRole="superadmin">
              <AdminDashboardPage />
            </ProtectedRoute>
          } />
          
          {/* Feature pages */}
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/notes/:id" element={<NotesPage />} />
          <Route path="/notes-graph" element={<NotesGraphPage />} />
          <Route path="/graph" element={<GraphViewPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/ai-settings" element={
            <ProtectedRoute requiredRole="superadmin">
              <AISettingsPage />
            </ProtectedRoute>
          } />
        </Route>
        
        {/* Not found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
