
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Notification {
  id: string;
  title: string;
  description?: string;
  type: string;
  entity_id?: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export const useNotifications = (limit = 10) => {
  const queryClient = useQueryClient();

  // Запрос списка уведомлений
  const query = useQuery({
    queryKey: ['notifications', limit],
    queryFn: async () => {
      try {
        // Получаем текущего пользователя
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError || !authData.user) {
          console.error("Ошибка авторизации:", authError || "Пользователь не авторизован");
          return [];
        }

        // Получаем уведомления пользователя, сначала непрочитанные и недавние
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', authData.user.id)
          .order('is_read', { ascending: true })
          .order('created_at', { ascending: false })
          .limit(limit);

        if (error) {
          console.error("Ошибка при получении уведомлений:", error);
          return [];
        }

        return data as Notification[];
      } catch (error) {
        console.error("Ошибка в useNotifications:", error);
        return [];
      }
    },
    staleTime: 1000 * 60, // 1 минута
  });

  // Мутация для отметки уведомления как прочитанное
  const markAsRead = useMutation({
    mutationFn: async (notificationId: string) => {
      const { data, error } = await supabase
        .from('notifications')
        .update({ is_read: true, updated_at: new Date().toISOString() })
        .eq('id', notificationId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-count'] });
    },
    onError: (error) => {
      console.error("Ошибка при обновлении уведомления:", error);
      toast.error("Не удалось отметить уведомление как прочитанное");
    }
  });

  // Мутация для отметки всех уведомлений как прочитанные
  const markAllAsRead = useMutation({
    mutationFn: async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) throw new Error("Пользователь не авторизован");

      const { data, error } = await supabase
        .from('notifications')
        .update({ is_read: true, updated_at: new Date().toISOString() })
        .eq('user_id', authData.user.id)
        .eq('is_read', false)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-count'] });
      toast.success("Все уведомления отмечены как прочитанные");
    },
    onError: (error) => {
      console.error("Ошибка при обновлении уведомлений:", error);
      toast.error("Не удалось отметить все уведомления как прочитанные");
    }
  });

  return {
    notifications: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    markAsRead,
    markAllAsRead
  };
};
