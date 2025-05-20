
import { useCallback } from 'react';
import { Task } from '@/types/tasks';
import { useTaskMutations } from '@/hooks/tasks/useTaskMutations';
import { toast } from 'sonner';

/**
 * Hook for common task operations with built-in error handling and feedback
 */
export const useTaskOperations = () => {
  const { updateTask, deleteTask, createTask } = useTaskMutations();
  
  const toggleCompletion = useCallback(async (task: Task) => {
    try {
      await updateTask({
        id: task.id,
        completed: !task.completed,
      });
      return true;
    } catch (error) {
      console.error("Error toggling task completion:", error);
      toast.error("Не удалось обновить статус задачи");
      return false;
    }
  }, [updateTask]);
  
  const removeTask = useCallback(async (taskId: string) => {
    try {
      await deleteTask(taskId);
      toast.success("Задача удалена");
      return true;
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Не удалось удалить задачу");
      return false;
    }
  }, [deleteTask]);
  
  const addTask = useCallback(async (taskData: Partial<Task>) => {
    try {
      // Убеждаемся, что обязательное поле title присутствует
      if (!taskData.title) {
        toast.error("Название задачи обязательно");
        return null;
      }
      
      const createTaskInput = {
        title: taskData.title,
        description: taskData.description || '',
        priority: taskData.priority || 'medium',
        dueDate: taskData.dueDate,
        completed: taskData.completed || false,
        content: taskData.content || {}
      };
      
      try {
        // Вызываем createTask без проверки возвращаемого значения
        createTask(createTaskInput);
        toast.success("Задача создана");
        // Возвращаем временный объект для совместимости
        return { success: true };
      } catch (error) {
        console.error("Error in createTask operation:", error);
        toast.error("Ошибка создания задачи");
        return null;
      }
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Не удалось создать задачу");
      return null;
    }
  }, [createTask]);
  
  return {
    toggleCompletion,
    removeTask,
    addTask
  };
};
