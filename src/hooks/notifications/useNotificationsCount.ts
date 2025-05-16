
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useNotificationsCount = () => {
  return useQuery({
    queryKey: ['notifications-count'],
    queryFn: async () => {
      try {
        // Получаем текущего пользователя
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError || !authData.user) {
          console.error("Ошибка авторизации:", authError || "Пользователь не авторизован");
          return 0;
        }
        
        // В реальном приложении здесь будет запрос к таблице уведомлений
        // Пока возвращаем случайное число от 0 до 3 для демонстрации
        // Когда будет готова таблица уведомлений, заменить на реальный запрос
        return Math.floor(Math.random() * 4);
      } catch (error) {
        console.error("Ошибка в useNotificationsCount:", error);
        return 0;
      }
    },
    staleTime: 1000 * 60, // 1 минута
  });
};
