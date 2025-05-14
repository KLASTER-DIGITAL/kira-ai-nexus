import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

// Auth Provider
import { AuthProvider } from "@/context/auth"; // Updated import
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/auth"; // Updated import

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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Role-based redirect component
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
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Smart Dashboard Redirect - detects role and redirects appropriately */}
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

            {/* Other protected routes */}
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
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
