
import { useCallback } from 'react';
import { TaskFilter } from '@/types/tasks';
import { useTaskQuery } from './tasks/useTaskQuery';
import { useTaskMutations } from './tasks/useTaskMutations';

export const useTasks = (filter?: TaskFilter) => {
  const { tasks, isLoading, error } = useTaskQuery(filter);
  const { createTask, updateTask, deleteTask } = useTaskMutations();
  
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
