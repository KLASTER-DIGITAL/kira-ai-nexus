
import { Location } from 'react-router-dom';
import { UserProfile } from '@/types/auth';

/**
 * Determines the appropriate redirect path based on user role and current location
 */
export const getRedirectPath = (
  profile: UserProfile | null, 
  location: Location,
  isAuthenticated: boolean
): string | null => {
  // Если пользователь не аутентифицирован, перенаправляем на страницу авторизации
  if (!isAuthenticated) {
    return '/auth';
  }

  // Специальная проверка для AI Settings - НЕ перенаправлять, если пользователь суперадмин
  if (profile?.role === 'superadmin' && location.pathname === '/ai-settings') {
    return null; // Разрешаем доступ к AI Settings для суперадмина без перенаправления
  }

  // Если пользователь суперадмин, но пытается получить доступ к пользовательской панели
  if (profile?.role === 'superadmin' && location.pathname === '/dashboard/user') {
    return '/dashboard/admin';
  }

  // Если пользователь не суперадмин, но пытается получить доступ к админской панели или ai-settings
  if (profile?.role !== 'superadmin' && 
      (location.pathname.includes('/dashboard/admin') || location.pathname === '/ai-settings')) {
    return '/dashboard/user';
  }

  // Перенаправление не требуется
  return null;
};
