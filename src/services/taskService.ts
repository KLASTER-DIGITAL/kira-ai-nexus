
import { supabase } from "@/integrations/supabase/client";
import { Task, TaskFilter, TaskPriority } from "@/types/tasks";

// Types for task operations
export type CreateTaskInput = Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'type'>;
export type UpdateTaskInput = Partial<Task> & { id: string };

// Fetch tasks with optional filtering
export const fetchTasks = async (userId: string, filter?: TaskFilter) => {
  if (!userId) throw new Error('User not authenticated');
  
  let query = supabase
    .from('nodes')
    .select('*')
    .eq('type', 'task')
    .eq('user_id', userId);
  
  if (filter) {
    if (filter.priority) {
      // Fix: Use string comparison instead of direct object comparison
      query = query.eq('content->>priority', filter.priority);
    }
    
    if (filter.completed !== undefined) {
      // Fix: Use string comparison for boolean values
      query = query.eq('content->>completed', filter.completed ? 'true' : 'false');
    }
    
    if (filter.dueDate) {
      // Fix: Use string comparison for date values
      query = query.eq('content->>dueDate', filter.dueDate);
    }
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
  
  // Transform Supabase data to Task objects
  return data.map(item => {
    const content = item.content as Record<string, any> || {};
    return {
      id: item.id,
      title: item.title,
      description: content.description,
      completed: content.completed === true || content.completed === 'true',
      priority: (content.priority || 'medium') as TaskPriority,
      dueDate: content.dueDate,
      user_id: item.user_id,
      created_at: item.created_at,
      updated_at: item.updated_at,
      type: 'task' as const
    };
  });
};

// Create a new task
export const createTask = async (userId: string, taskData: CreateTaskInput) => {
  if (!userId) throw new Error('User not authenticated');
  
  const { title, priority, completed, dueDate, description } = taskData;
  
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
      title,
      content: taskContent,
      user_id: userId
    })
    .select();
  
  if (error) {
    console.error('Error creating task:', error);
    throw error;
  }
  
  return data[0];
};

// Update an existing task
export const updateTask = async (userId: string, taskData: UpdateTaskInput) => {
  if (!userId) throw new Error('User not authenticated');
  
  // Get current task data
  const { data: currentTask, error: fetchError } = await supabase
    .from('nodes')
    .select('*')
    .eq('id', taskData.id)
    .eq('user_id', userId)
    .single();
  
  if (fetchError) {
    console.error('Error fetching task for update:', fetchError);
    throw fetchError;
  }
  
  // Merge current content with updates
  const { priority, completed, dueDate, description, title } = taskData;
  
  const currentContent = currentTask.content as Record<string, any> || {};
  
  const updatedContent = {
    ...currentContent,
    ...(priority !== undefined && { priority }),
    ...(completed !== undefined && { completed }),
    ...(dueDate !== undefined && { dueDate }),
    ...(description !== undefined && { description })
  };
  
  const updateData: Record<string, any> = {
    content: updatedContent
  };
  
  if (title !== undefined) {
    updateData.title = title;
  }
  
  const { data, error } = await supabase
    .from('nodes')
    .update(updateData)
    .eq('id', taskData.id)
    .eq('user_id', userId)
    .select();
  
  if (error) {
    console.error('Error updating task:', error);
    throw error;
  }
  
  return data[0];
};

// Delete a task
export const deleteTask = async (userId: string, taskId: string) => {
  if (!userId) throw new Error('User not authenticated');
  
  const { error } = await supabase
    .from('nodes')
    .delete()
    .eq('id', taskId)
    .eq('user_id', userId)
    .eq('type', 'task');
  
  if (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
  
  return taskId;
};
