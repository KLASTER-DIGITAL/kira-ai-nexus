
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { ProtectedRoute } from './components/features/auth';

// Import pages from the new structure
import {
  Index,
  HomePage,
  AuthPage, 
  ResetPasswordPage,
  DashboardPage,
  UserDashboardPage,
  AdminDashboardPage,
  NotesPage,
  NotesGraphPage,
  TasksPage,
  AISettingsPage,
  HelpPage,
  UserHelpPage,
  AdminHelpPage,
  NotFound
} from './pages';

// Import pages that haven't been refactored yet
import CalendarPage from './pages/CalendarPage';
import ChatPage from './pages/ChatPage';

function App() {
  // Установка favicon программно
  useEffect(() => {
    const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (!link) {
      const newLink = document.createElement('link');
      newLink.rel = 'icon';
      newLink.href = '/favicon.ico';
      document.getElementsByTagName('head')[0].appendChild(newLink);
    }
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/dashboard/user" element={<ProtectedRoute><UserDashboardPage /></ProtectedRoute>} />
        <Route path="/dashboard/admin" element={<ProtectedRoute requiredRole="superadmin"><AdminDashboardPage /></ProtectedRoute>} />
        <Route path="/notes" element={<ProtectedRoute><NotesPage /></ProtectedRoute>} />
        <Route path="/notes/graph" element={<ProtectedRoute><NotesGraphPage /></ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute><TasksPage /></ProtectedRoute>} />
        <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
        <Route path="/ai-settings" element={<ProtectedRoute><AISettingsPage /></ProtectedRoute>} />
        
        {/* Help pages */}
        <Route path="/help" element={<ProtectedRoute><HelpPage /></ProtectedRoute>} />
        <Route path="/help/user" element={<ProtectedRoute><UserHelpPage /></ProtectedRoute>} />
        <Route path="/help/admin" element={<ProtectedRoute requiredRole="superadmin"><AdminHelpPage /></ProtectedRoute>} />
        
        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
