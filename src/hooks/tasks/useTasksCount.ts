
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useTasksCount = () => {
  return useQuery({
    queryKey: ['tasks-count'],
    queryFn: async () => {
      try {
        // Получаем текущего пользователя
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError || !authData.user) {
          console.error("Ошибка авторизации:", authError || "Пользователь не авторизован");
          return 0;
        }
        
        // Получаем количество активных задач
        const { count, error } = await supabase
          .from('nodes')
          .select('*', { count: 'exact', head: true })
          .eq('type', 'task')
          .eq('user_id', authData.user.id);

        if (error) {
          console.error("Ошибка при получении количества задач:", error);
          return 0;
        }

        return count || 0;
      } catch (error) {
        console.error("Ошибка в useTasksCount:", error);
        return 0;
      }
    },
    staleTime: 1000 * 60, // 1 минута
  });
};
