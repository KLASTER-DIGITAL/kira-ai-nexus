
import { TaskPriority } from "@/types/tasks";

/**
 * Get CSS class for priority badge based on priority level
 * Supports both light and dark mode
 */
export const getPriorityBadgeClass = (priority: TaskPriority): string => {
  switch (priority) {
    case 'low':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    case 'medium':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
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

/**
 * Get color for priority icon
 */
export const getPriorityColor = (priority: TaskPriority) => {
  switch (priority) {
    case "high":
      return "text-red-500 dark:text-red-400";
    case "medium":
      return "text-amber-500 dark:text-amber-400";
    case "low":
      return "text-green-500 dark:text-green-400";
    default:
      return "text-muted-foreground";
  }
};
