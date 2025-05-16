
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

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
            console.log('Получено событие реального времени:', payload);
            // Инвалидируем кэш при любых изменениях данных
            queryClient.invalidateQueries({ queryKey: ['notes'] });
          }
        )
        .subscribe((status) => {
          console.log('Статус подписки на реальное время:', status);
        });
      
      // Возвращаем функцию отписки для использования в useEffect
      return () => {
        console.log('Отписка от канала реального времени');
        supabase.removeChannel(channel);
      };
    } catch (error) {
      console.error('Ошибка при настройке подписки реального времени:', error);
      return () => {}; // Возвращаем пустую функцию в случае ошибки
    }
  };

  return { setupRealtimeSubscription };
};
