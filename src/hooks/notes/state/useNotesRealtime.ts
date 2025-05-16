
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useNotesRealtime = () => {
  const queryClient = useQueryClient();
  
  // Настройка подписки на изменения в реальном времени
  const setupRealtimeSubscription = () => {
    try {
      // Подписываемся на изменения в таблице nodes для типа note
      const channel = supabase
        .channel('notes-changes')
        .on(
          'postgres_changes',
          {
            event: '*', // Слушаем все события (INSERT, UPDATE, DELETE)
            schema: 'public',
            table: 'nodes',
            filter: `type=eq.note` // Фильтруем только заметки
          },
          (payload) => {
            console.log('Получено событие реального времени для заметок:', payload);
            
            // Инвалидируем кэш при любых изменениях данных
            queryClient.invalidateQueries({ queryKey: ['notes'] });
            
            // Показываем уведомление в зависимости от типа события
            if (payload.eventType === 'INSERT') {
              toast.info('Создана новая заметка', { 
                description: payload.new.title
              });
            } else if (payload.eventType === 'UPDATE') {
              toast.info('Заметка обновлена', {
                description: payload.new.title
              });
            } else if (payload.eventType === 'DELETE') {
              toast.info('Заметка удалена');
            }
          }
        )
        .subscribe((status) => {
          console.log('Статус подписки на реальное время для заметок:', status);
        });
      
      // Возвращаем функцию отписки для использования в useEffect
      return () => {
        console.log('Отписка от канала реального времени заметок');
        supabase.removeChannel(channel);
      };
    } catch (error) {
      console.error('Ошибка при настройке подписки реального времени для заметок:', error);
      return () => {}; // Возвращаем пустую функцию в случае ошибки
    }
  };

  return { setupRealtimeSubscription };
};
