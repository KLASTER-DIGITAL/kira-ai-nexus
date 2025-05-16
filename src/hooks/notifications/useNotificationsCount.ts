
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
        
        // Получаем количество непрочитанных уведомлений
        const { count, error } = await supabase
          .from('notifications')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', authData.user.id)
          .eq('is_read', false);

        if (error) {
          console.error("Ошибка при получении количества уведомлений:", error);
          return 0;
        }

        return count || 0;
      } catch (error) {
        console.error("Ошибка в useNotificationsCount:", error);
        return 0;
      }
    },
    staleTime: 1000 * 60, // 1 минута
  });
};
