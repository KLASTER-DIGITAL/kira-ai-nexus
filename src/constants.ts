
/**
 * Константы проекта KIRA AI
 */

// Роли пользователей
export const USER_ROLES = {
  USER: 'user',
  SUPER_ADMIN: 'superadmin',
};

// Типы заметок
export const NOTE_TYPES = {
  NOTE: 'note',
  TASK: 'task',
  EVENT: 'event',
};

// Приоритеты задач
export const TASK_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
};

// Статусы задач
export const TASK_STATUSES = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  DONE: 'done',
  CANCELED: 'canceled',
};

// Цветовая палитра для заметок и тегов
export const NOTE_COLORS = [
  { name: 'purple', value: '#8b5cf6' },
  { name: 'blue', value: '#3b82f6' },
  { name: 'green', value: '#10b981' },
  { name: 'yellow', value: '#f59e0b' },
  { name: 'red', value: '#ef4444' },
  { name: 'pink', value: '#ec4899' },
  { name: 'gray', value: '#6b7280' },
];

// Параметры пагинации
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
};

// API endpoints для n8n webhooks
export const API_ENDPOINTS = {
  N8N_WEBHOOK: '/api/n8n-webhook',
};

// Типы связей между заметками
export const LINK_TYPES = {
  REFERENCE: 'reference',
  PARENT_CHILD: 'parent_child',
  RELATES_TO: 'relates_to',
};
