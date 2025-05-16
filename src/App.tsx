
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from './context/auth';
import { Toaster } from '@/components/ui/toaster';

// Новый основной макет
import { MainLayout } from '@/components/layouts/MainLayout';

// Страницы
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
  return (
    <>
      <Routes>
        {/* Публичные маршруты */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/index" element={<Index />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        
        {/* Защищенные маршруты с новым макетом */}
        <Route element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          {/* Маршруты дашборда */}
          <Route path="/dashboard" element={<Navigate to="/dashboard/user" replace />} />
          <Route path="/dashboard/user" element={<UserDashboardPage />} />
          <Route path="/dashboard/admin" element={
            <ProtectedRoute requiredRole="superadmin">
              <AdminDashboardPage />
            </ProtectedRoute>
          } />
          
          {/* Функциональные страницы */}
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
          
          {/* Добавим маршруты для новых страниц */}
          <Route path="/activity" element={<UnderConstructionPage title="Активность" />} />
          <Route path="/notifications" element={<UnderConstructionPage title="Уведомления" />} />
          <Route path="/settings" element={<UnderConstructionPage title="Настройки" />} />
          <Route path="/profile" element={<UnderConstructionPage title="Профиль" />} />
        </Route>
        
        {/* Not found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}

// Временная страница для новых разделов, которые еще в разработке
function UnderConstructionPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center">
      <div className="rounded-full bg-primary/10 p-6 mb-4">
        <Settings className="h-10 w-10 text-primary" />
      </div>
      <h1 className="text-2xl font-semibold mb-2">{title}</h1>
      <p className="text-muted-foreground max-w-md">
        Эта страница находится в разработке и скоро будет доступна.
      </p>
    </div>
  );
}

// Добавим импорт иконки Settings
import { Settings } from "lucide-react";

export default App;
