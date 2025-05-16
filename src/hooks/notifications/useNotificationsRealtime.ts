
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useNotificationsRealtime = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Настраиваем слушателя для новых уведомлений
    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
        },
        (payload) => {
          console.log('Получено событие уведомлений в реальном времени:', payload);
          
          // Инвалидируем кэш при изменениях
          queryClient.invalidateQueries({ queryKey: ['notifications'] });
          queryClient.invalidateQueries({ queryKey: ['notifications-count'] });
          
          // Показываем тост-уведомление о новом событии, если это новое уведомление
          if (payload.eventType === 'INSERT') {
            const newNotification = payload.new;
            toast.info(
              `${newNotification.title}`,
              { description: newNotification.description, duration: 5000 }
            );
          }
        }
      )
      .subscribe((status) => {
        console.log('Статус подписки на уведомления:', status);
      });

    return () => {
      console.log('Отписка от канала уведомлений');
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
};
