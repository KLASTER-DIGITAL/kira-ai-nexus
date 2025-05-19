
import { UserProfile } from './auth';

export type TaskPriority = 'low' | 'medium' | 'high';
export type RecurringType = 'daily' | 'weekly' | 'monthly';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: TaskPriority;
  dueDate?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  type: 'task';
  content?: {
    completed?: boolean;
    tags?: string[];
    category?: string;
    reminder?: boolean;
    recurring?: boolean;
    recurring_type?: RecurringType;
    [key: string]: any;
  };
}

export interface TaskFilter {
  priority?: TaskPriority;
  completed?: boolean;
  dueDate?: string;
  tags?: string[];
}
