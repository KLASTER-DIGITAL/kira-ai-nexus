
import { Routes, Route } from 'react-router-dom'
import { Toaster } from "@/components/ui/toaster"

// Pages
import Index from './pages/Index'
import NotFound from './pages/NotFound'
import CalendarPage from './pages/CalendarPage'
import ChatPage from './pages/ChatPage'
import DashboardPage from './pages/DashboardPage'
import UserDashboardPage from './pages/UserDashboardPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import NotesPage from './pages/NotesPage'
import NotesGraphPage from './pages/NotesGraphPage'
import TasksPage from './pages/TasksPage'
import AISettingsPage from './pages/AISettingsPage'
import AuthPage from './pages/AuthPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import ProtectedRoute from './components/auth/ProtectedRoute'
import HomePage from './pages/HomePage'

function App() {
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
        
        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App
