
import { useCallback, useEffect } from 'react';
import { TaskFilter } from '@/types/tasks';
import { useTaskQuery } from './hooks/tasks/useTaskQuery';
import { useTaskMutations } from './hooks/tasks/useTaskMutations';
import { useTasksRealtime } from './hooks/tasks/useTasksRealtime';

export const useTasks = (filter?: TaskFilter) => {
  const { tasks, isLoading, error } = useTaskQuery(filter);
  const { createTask, updateTask, deleteTask } = useTaskMutations();
  
  // Используем слушателя реального времени для задач
  useTasksRealtime();
  
  // Toggle task completion helper
  const toggleTaskCompletion = useCallback(
    (taskId: string) => {
      const task = tasks?.find((t) => t.id === taskId);
      if (task) {
        updateTask({
          id: task.id,
          completed: !task.completed,
        });
      }
    },
    [tasks, updateTask]
  );

  return {
    tasks,
    isLoading,
    error,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
  };
};
