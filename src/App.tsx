
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

// Auth Provider and Protected Route
import { useAuth } from "@/context/auth";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Pages
import LandingPage from "./pages/LandingPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AuthPage from "./pages/AuthPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ChatPage from "./pages/ChatPage";
import TasksPage from "./pages/TasksPage";
import NotesPage from "./pages/NotesPage";
import CalendarPage from "./pages/CalendarPage";
import AISettingsPage from "./pages/AISettingsPage";
import NotFound from "./pages/NotFound";

// Optimize QueryClient with better caching settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes cache
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: true
    },
  }
});

// Component for role-based redirect
const RoleBasedRedirect = () => {
  const { profile } = useAuth();
  
  if (profile?.role === 'superadmin') {
    return <Navigate to="/dashboard/admin" replace />;
  }
  
  return <Navigate to="/dashboard/user" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Smart redirect based on role */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <RoleBasedRedirect />
            </ProtectedRoute>
          } 
        />
        
        {/* User dashboard */}
        <Route 
          path="/dashboard/user" 
          element={
            <ProtectedRoute>
              <UserDashboardPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Admin dashboard */}
        <Route 
          path="/dashboard/admin" 
          element={
            <ProtectedRoute requiredRole="superadmin">
              <AdminDashboardPage />
            </ProtectedRoute>
          } 
        />

        {/* AI Settings page - direct access for superadmins */}
        <Route 
          path="/ai-settings" 
          element={
            <ProtectedRoute requiredRole="superadmin">
              <AISettingsPage />
            </ProtectedRoute>
          } 
        />

        {/* Другие защищенные маршруты */}
        <Route 
          path="/chat" 
          element={
            <ProtectedRoute>
              <ChatPage />
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
          path="/notes" 
          element={
            <ProtectedRoute>
              <NotesPage />
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
        
        {/* 404 page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
