
import { TaskPriority } from "@/types/tasks";

export const getPriorityColor = (priority: TaskPriority) => {
  switch (priority) {
    case "high":
      return "text-red-500";
    case "medium":
      return "text-amber-500";
    case "low":
      return "text-green-500";
    default:
      return "";
  }
};

export const getPriorityBadgeClass = (priority: TaskPriority) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
    case "medium":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
    case "low":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    default:
      return "";
  }
};

export const getPriorityLabel = (priority: TaskPriority) => {
  switch (priority) {
    case "high":
      return "Высокий";
    case "medium":
      return "Средний";
    case "low":
      return "Низкий";
    default:
      return "";
  }
};
