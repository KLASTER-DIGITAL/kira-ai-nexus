
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { createTask, updateTask, deleteTask, CreateTaskInput, UpdateTaskInput } from '@/services/taskService';
import { useAuth } from '@/context/auth';

export const useTaskMutations = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: (newTask: CreateTaskInput) => {
      if (!user) throw new Error('User not authenticated');
      return createTask(user.id, newTask);
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

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: (updatedTask: UpdateTaskInput) => {
      if (!user) throw new Error('User not authenticated');
      return updateTask(user.id, updatedTask);
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

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: (taskId: string) => {
      if (!user) throw new Error('User not authenticated');
      return deleteTask(user.id, taskId);
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

  return {
    createTask: createTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate
  };
};
