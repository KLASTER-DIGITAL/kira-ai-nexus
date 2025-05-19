
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
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
      queryClient.invalidateQueries({ queryKey: ['tasks-count'] });
      toast.success("Задача создана", {
        description: "Новая задача успешно добавлена"
      });
    },
    onError: (error) => {
      toast.error("Ошибка", {
        description: `Не удалось создать задачу: ${error.message}`
      });
    }
  });

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: (updatedTask: UpdateTaskInput) => {
      if (!user) throw new Error('User not authenticated');
      return updateTask(user.id, updatedTask);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks-count'] });
      
      // Проверяем, изменилось ли состояние завершенности задачи
      const isCompleted = typeof data.content === 'object' && data.content?.completed;
      
      if (isCompleted) {
        toast.success("Задача выполнена", {
          description: `Задача "${data.title}" отмечена как выполненная`
        });
      } else {
        toast.success("Задача обновлена", {
          description: "Изменения сохранены"
        });
      }
    },
    onError: (error) => {
      toast.error("Ошибка", {
        description: `Не удалось обновить задачу: ${error.message}`
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
      queryClient.invalidateQueries({ queryKey: ['tasks-count'] });
      toast.info("Задача удалена", {
        description: "Задача была успешно удалена"
      });
    },
    onError: (error) => {
      toast.error("Ошибка", {
        description: `Не удалось удалить задачу: ${error.message}`
      });
    }
  });

  return {
    createTask: createTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
    isCreating: createTaskMutation.isPending,
    isUpdating: updateTaskMutation.isPending,
    isDeleting: deleteTaskMutation.isPending
  };
};
