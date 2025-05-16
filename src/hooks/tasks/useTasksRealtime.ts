
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useTasksRealtime = () => {
  const queryClient = useQueryClient();
  
  useEffect(() => {
    // Настраиваем слушателя для задач
    const channel = supabase
      .channel('tasks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'nodes',
          filter: 'type=eq.task'
        },
        (payload) => {
          console.log('Получено событие реального времени для задач:', payload);
          
          // Инвалидируем кэш при изменениях
          queryClient.invalidateQueries({ queryKey: ['tasks'] });
          queryClient.invalidateQueries({ queryKey: ['tasks-count'] });
          
          // Показываем уведомление в зависимости от типа события
          if (payload.eventType === 'INSERT') {
            toast.info('Создана новая задача', { 
              description: payload.new.title
            });
          } else if (payload.eventType === 'UPDATE') {
            const newData = payload.new;
            const oldData = payload.old;
            
            if (newData.content?.completed && !oldData.content?.completed) {
              toast.success('Задача выполнена', {
                description: newData.title
              });
            } else if (!newData.content?.completed && oldData.content?.completed) {
              toast.info('Задача возобновлена', {
                description: newData.title
              });
            } else {
              toast.info('Задача обновлена', {
                description: newData.title
              });
            }
          } else if (payload.eventType === 'DELETE') {
            toast.info('Задача удалена');
          }
        }
      )
      .subscribe((status) => {
        console.log('Статус подписки на реальное время для задач:', status);
      });
    
    return () => {
      console.log('Отписка от канала реального времени задач');
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
};
