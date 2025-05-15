
import { TaskPriority } from "@/types/tasks";

/**
 * Get CSS class for priority badge based on priority level
 */
export const getPriorityBadgeClass = (priority: TaskPriority): string => {
  switch (priority) {
    case 'low':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    case 'medium':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    case 'high':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400';
  }
};

/**
 * Get human-readable priority label
 */
export const getPriorityLabel = (priority: TaskPriority): string => {
  switch (priority) {
    case 'low':
      return 'Низкий';
    case 'medium':
      return 'Средний';
    case 'high':
      return 'Высокий';
    default:
      return 'Неизвестно';
  }
};
