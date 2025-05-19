
import { Task, TaskPriority } from "@/types/tasks";

/**
 * Pattern to match task syntax in notes
 * Examples:
 * - [ ] Task description @high #tag1 #tag2 due:2023-05-20
 * - [x] Completed task @medium #project
 */
const TASK_PATTERN = /- \[([ x])\] (.*?)(?:@(high|medium|low))?(?: due:(\d{4}-\d{2}-\d{2}))?(?:\s((?:#\w+\s*)+))?/g;

/**
 * Extract tags from text with format #tag1 #tag2
 */
const extractTags = (tagText?: string): string[] => {
  if (!tagText) return [];
  return tagText.trim().split(/\s+/).map(tag => tag.startsWith('#') ? tag.substring(1) : tag);
};

/**
 * Extract priority from text (@high, @medium, @low)
 */
const extractPriority = (priorityText?: string): TaskPriority => {
  if (!priorityText) return 'medium';
  
  switch (priorityText.toLowerCase()) {
    case 'high': return 'high';
    case 'low': return 'low';
    default: return 'medium';
  }
};

/**
 * Parse tasks from note content
 */
export const extractTasksFromNote = (content: string): Array<Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>> => {
  if (!content) return [];
  
  const tasks: Array<Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>> = [];
  const matches = content.matchAll(TASK_PATTERN);
  
  for (const match of matches) {
    const [_, completedMark, description, priority, dueDate, tagText] = match;
    
    const tags = extractTags(tagText);
    
    tasks.push({
      title: description.trim(),
      description: '',
      completed: completedMark === 'x',
      priority: extractPriority(priority),
      dueDate: dueDate || undefined,
      type: 'task',
      content: {
        tags: tags,
        category: tags.length > 0 ? tags[0] : undefined
      }
    });
  }
  
  return tasks;
};

/**
 * Checks if text contains task syntax
 */
export const containsTasks = (content: string): boolean => {
  return TASK_PATTERN.test(content);
};

/**
 * Replace task markers in content
 */
export const replaceTaskMarkers = (content: string, taskId: string, completed: boolean): string => {
  // Placeholder for more advanced replacement logic
  return content;
};

