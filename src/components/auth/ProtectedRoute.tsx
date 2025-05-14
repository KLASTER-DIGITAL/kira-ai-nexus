
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import LoadingScreen from './LoadingScreen';
import { getRedirectPath } from './authUtils';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'superadmin';
}

/**
 * ProtectedRoute component that handles authentication and role-based access
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { isAuthenticated, isLoading, profile } = useAuth();
  const location = useLocation();

  // Если всё ещё загружается состояние аутентификации, показываем индикатор загрузки
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Не аутентифицирован - перенаправление на страницу входа
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  // Для маршрутов с конкретной требуемой ролью (явное указание requiredRole)
  if (requiredRole && profile?.role !== requiredRole) {
    const fallbackPath = profile?.role === 'superadmin' ? '/dashboard/admin' : '/dashboard/user';
    return <Navigate to={fallbackPath} replace />;
  }

  // Проверка для перенаправления на основе роли и текущего пути
  // Специальная проверка для страницы AI Settings - предотвращаем циклическое перенаправление
  if (profile?.role === 'superadmin' && location.pathname === '/ai-settings') {
    return <>{children}</>; // Разрешаем доступ без дополнительных проверок
  }
  
  // Проверяем другие возможные перенаправления
  const redirectPath = getRedirectPath(profile, location, isAuthenticated);
  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  // Пользователь аутентифицирован и имеет нужную роль, отображаем дочерние компоненты
  return <>{children}</>;
};

export default ProtectedRoute;
