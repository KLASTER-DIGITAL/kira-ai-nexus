
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/auth';
import { NotificationSettings } from '@/types/notifications';
import { toast } from 'sonner';

export const useNotificationSettings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Получение настроек уведомлений
  const {
    data: settings,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['notification-settings', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Ошибка получения настроек уведомлений:', error);
        throw error;
      }

      return data as NotificationSettings;
    },
    enabled: !!user,
  });

  // Обновление настроек уведомлений
  const updateSettings = useMutation({
    mutationFn: async (updates: Partial<NotificationSettings>) => {
      if (!user) throw new Error('Пользователь не авторизован');

      const { data, error } = await supabase
        .from('notification_settings')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-settings'] });
      toast.success('Настройки уведомлений обновлены');
    },
    onError: (error) => {
      console.error('Ошибка обновления настроек:', error);
      toast.error('Не удалось обновить настройки уведомлений');
    },
  });

  return {
    settings,
    isLoading,
    error,
    updateSettings: updateSettings.mutate,
    isUpdating: updateSettings.isPending,
  };
};
