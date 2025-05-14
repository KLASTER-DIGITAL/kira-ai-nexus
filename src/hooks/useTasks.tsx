
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Task, TaskFilter, TaskPriority } from '@/types/tasks';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/auth';
import { toast } from '@/hooks/use-toast';

export const useTasks = (filter?: TaskFilter) => {
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();
  
  // Fetch tasks with optional filtering
  const {
    data: tasks,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['tasks', filter],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      let query = supabase
        .from('nodes')
        .select('*')
        .eq('type', 'task')
        .eq('user_id', user.id);
      
      if (filter) {
        if (filter.priority) {
          query = query.eq('content->>priority', filter.priority);
        }
        
        if (filter.completed !== undefined) {
          query = query.eq('content->>completed', filter.completed.toString());
        }
        
        if (filter.dueDate) {
          query = query.eq('content->>dueDate', filter.dueDate);
        }
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching tasks:', error);
        throw error;
      }
      
      // Преобразуем данные из Supabase в формат Task
      return data.map(item => ({
        id: item.id,
        title: item.title,
        description: item.content?.description,
        completed: item.content?.completed === true || item.content?.completed === 'true',
        priority: (item.content?.priority || 'medium') as TaskPriority,
        dueDate: item.content?.dueDate,
        user_id: item.user_id,
        created_at: item.created_at,
        updated_at: item.updated_at,
        type: 'task' as const
      }));
    },
    enabled: !!user
  });

  // Create new task
  const createTaskMutation = useMutation({
    mutationFn: async (newTask: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'type'>) => {
      if (!user) throw new Error('User not authenticated');
      
      const { priority, completed, dueDate, description, ...rest } = newTask;
      
      const taskContent = {
        priority,
        completed,
        dueDate,
        description
      };
      
      const { data, error } = await supabase
        .from('nodes')
        .insert({
          type: 'task',
          title: newTask.title,
          content: taskContent,
          user_id: user.id
        })
        .select();
      
      if (error) {
        console.error('Error creating task:', error);
        throw error;
      }
      
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "Задача создана",
        description: "Новая задача успешно добавлена"
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: `Не удалось создать задачу: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Update task
  const updateTaskMutation = useMutation({
    mutationFn: async (updatedTask: Partial<Task> & { id: string }) => {
      if (!user) throw new Error('User not authenticated');
      
      // Get current task data first
      const { data: currentTask, error: fetchError } = await supabase
        .from('nodes')
        .select('*')
        .eq('id', updatedTask.id)
        .eq('user_id', user.id)
        .single();
      
      if (fetchError) {
        console.error('Error fetching task for update:', fetchError);
        throw fetchError;
      }
      
      // Merge current content with updates
      const { priority, completed, dueDate, description, title } = updatedTask;
      
      const taskContent = {
        ...(currentTask.content || {}),
        ...(priority !== undefined && { priority }),
        ...(completed !== undefined && { completed }),
        ...(dueDate !== undefined && { dueDate }),
        ...(description !== undefined && { description })
      };
      
      const updateData: any = {
        content: taskContent
      };
      
      if (title !== undefined) {
        updateData.title = title;
      }
      
      const { data, error } = await supabase
        .from('nodes')
        .update(updateData)
        .eq('id', updatedTask.id)
        .eq('user_id', user.id)
        .select();
      
      if (error) {
        console.error('Error updating task:', error);
        throw error;
      }
      
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "Задача обновлена",
        description: "Изменения сохранены"
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: `Не удалось обновить задачу: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Delete task
  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('nodes')
        .delete()
        .eq('id', taskId)
        .eq('user_id', user.id)
        .eq('type', 'task');
      
      if (error) {
        console.error('Error deleting task:', error);
        throw error;
      }
      
      return taskId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "Задача удалена",
        description: "Задача была успешно удалена"
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: `Не удалось удалить задачу: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Toggle task completion
  const toggleTaskCompletion = useCallback(
    (taskId: string) => {
      const task = tasks?.find((t) => t.id === taskId);
      if (task) {
        updateTaskMutation.mutate({
          id: task.id,
          completed: !task.completed,
        });
      }
    },
    [tasks, updateTaskMutation]
  );

  return {
    tasks,
    isLoading,
    error,
    createTask: createTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
    toggleTaskCompletion,
  };
};
