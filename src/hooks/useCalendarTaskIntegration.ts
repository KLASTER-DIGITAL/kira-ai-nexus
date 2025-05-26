
import { useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/auth';
import { toast } from 'sonner';

export const useCalendarTaskIntegration = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const moveTaskToDate = useMutation({
    mutationFn: async ({ taskId, newDate }: { taskId: string; newDate: Date }) => {
      if (!user) throw new Error('User not authenticated');

      // Обновляем дату задачи в таблице nodes
      const { data, error } = await supabase
        .from('nodes')
        .update({
          content: {
            dueDate: newDate.toISOString(),
            updated_at: new Date().toISOString()
          }
        })
        .eq('id', taskId)
        .eq('user_id', user.id)
        .eq('type', 'task')
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['calendar'] });
      toast.success('Задача перемещена', {
        description: 'Дата выполнения задачи обновлена'
      });
    },
    onError: (error) => {
      toast.error('Ошибка', {
        description: `Не удалось переместить задачу: ${error.message}`
      });
    }
  });

  const toggleTaskFromCalendar = useMutation({
    mutationFn: async ({ taskId, completed }: { taskId: string; completed: boolean }) => {
      if (!user) throw new Error('User not authenticated');

      // Получаем текущие данные задачи
      const { data: currentTask, error: fetchError } = await supabase
        .from('nodes')
        .select('content')
        .eq('id', taskId)
        .eq('user_id', user.id)
        .single();

      if (fetchError) throw fetchError;

      // Обновляем статус завершения
      const updatedContent = {
        ...currentTask.content,
        completed: completed.toString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('nodes')
        .update({ content: updatedContent })
        .eq('id', taskId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['calendar'] });
    },
    onError: (error) => {
      toast.error('Ошибка', {
        description: `Не удалось обновить статус задачи: ${error.message}`
      });
    }
  });

  return {
    moveTaskToDate: moveTaskToDate.mutate,
    toggleTaskFromCalendar: toggleTaskFromCalendar.mutate,
    isMovingTask: moveTaskToDate.isPending,
    isTogglingTask: toggleTaskFromCalendar.isPending
  };
};
