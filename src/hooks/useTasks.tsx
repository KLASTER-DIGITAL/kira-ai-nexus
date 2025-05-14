
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Task, TaskFilter } from '@/types/tasks';

// Mock data and functions for now
// In a real implementation this would connect to your Supabase backend
const mockTasks: Task[] = [
  {
    id: "1",
    title: "Создать MVP для KIRA AI",
    completed: false,
    priority: "high",
    dueDate: "2025-05-20",
  },
  {
    id: "2",
    title: "Добавить интеграцию с OpenAI API",
    completed: false,
    priority: "medium",
    dueDate: "2025-05-25",
  },
  {
    id: "3",
    title: "Разработать документацию API",
    completed: true,
    priority: "low",
  },
];

export const useTasks = (filter?: TaskFilter) => {
  const queryClient = useQueryClient();
  
  // Fetch tasks with optional filtering
  const {
    data: tasks,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['tasks', filter],
    queryFn: async () => {
      // In real implementation this would be a fetch to Supabase
      // With filters applied to the query
      return mockTasks.filter(task => {
        if (!filter) return true;
        
        let matches = true;
        
        if (filter.priority !== undefined) {
          matches = matches && task.priority === filter.priority;
        }
        
        if (filter.completed !== undefined) {
          matches = matches && task.completed === filter.completed;
        }
        
        return matches;
      });
    }
  });

  // Create new task
  const createTaskMutation = useMutation({
    mutationFn: async (newTask: Omit<Task, 'id'>) => {
      // In real implementation this would be a POST to Supabase
      const task: Task = {
        ...newTask,
        id: Date.now().toString(),
      };
      return task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // Update task
  const updateTaskMutation = useMutation({
    mutationFn: async (updatedTask: Task) => {
      // In real implementation this would be a PUT to Supabase
      return updatedTask;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // Delete task
  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      // In real implementation this would be a DELETE to Supabase
      return taskId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // Toggle task completion
  const toggleTaskCompletion = useCallback(
    (taskId: string) => {
      const task = tasks?.find((t) => t.id === taskId);
      if (task) {
        updateTaskMutation.mutate({
          ...task,
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
