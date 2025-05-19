
export interface NoteTemplate {
  id: string;
  name: string;
  description: string;
  content: string;
  tags: string[];
  color?: string;
  icon?: string;
}

export const DEFAULT_TEMPLATES: NoteTemplate[] = [
  {
    id: 'blank',
    name: 'Пустая заметка',
    description: 'Чистая заметка без содержимого',
    content: '',
    tags: [],
    icon: 'file-text',
  },
  {
    id: 'meeting',
    name: 'Встреча',
    description: 'Шаблон для записи встреч',
    content: `<h1>Встреча: [Название]</h1>
<p><strong>Дата:</strong> [Дата]</p>
<p><strong>Участники:</strong> [Список участников]</p>

<h2>Повестка дня</h2>
<ul>
  <li>Пункт 1</li>
  <li>Пункт 2</li>
  <li>Пункт 3</li>
</ul>

<h2>Обсуждение</h2>
<p>[Заметки по обсуждению]</p>

<h2>Решения</h2>
<ul>
  <li>[Решение 1]</li>
  <li>[Решение 2]</li>
</ul>

<h2>Последующие действия</h2>
<ul>
  <li>[Действие 1] - Ответственный: [Имя]</li>
  <li>[Действие 2] - Ответственный: [Имя]</li>
</ul>`,
    tags: ['встреча', 'протокол'],
    color: 'bg-blue-100',
    icon: 'users',
  },
  {
    id: 'todo',
    name: 'Список дел',
    description: 'Для создания списка задач',
    content: `<h1>Список дел</h1>

<h2>Приоритетные</h2>
<ul>
  <li>[ ] Задача 1</li>
  <li>[ ] Задача 2</li>
  <li>[ ] Задача 3</li>
</ul>

<h2>В процессе</h2>
<ul>
  <li>[ ] Задача в процессе 1</li>
  <li>[ ] Задача в процессе 2</li>
</ul>

<h2>Завершенные</h2>
<ul>
  <li>[x] Завершенная задача 1</li>
</ul>`,
    tags: ['задачи', 'список дел'],
    color: 'bg-green-100',
    icon: 'check-circle',
  },
  {
    id: 'idea',
    name: 'Идея',
    description: 'Для записи идей и мыслей',
    content: `<h1>Идея: [Название]</h1>

<h2>Описание</h2>
<p>[Описание идеи]</p>

<h2>Почему это важно?</h2>
<p>[Обоснование]</p>

<h2>Возможная реализация</h2>
<ul>
  <li>[Шаг 1]</li>
  <li>[Шаг 2]</li>
  <li>[Шаг 3]</li>
</ul>

<h2>Ресурсы</h2>
<ul>
  <li>[Ресурс 1]</li>
  <li>[Ресурс 2]</li>
</ul>`,
    tags: ['идея', 'концепт'],
    color: 'bg-purple-100',
    icon: 'lightbulb',
  },
  {
    id: 'journal',
    name: 'Дневник',
    description: 'Для ведения дневниковых записей',
    content: `<h1>Запись от [Дата]</h1>

<h2>Сегодняшние события</h2>
<p>[Основные события дня]</p>

<h2>Мысли и наблюдения</h2>
<p>[Ваши мысли]</p>

<h2>На завтра</h2>
<ul>
  <li>[Дело 1]</li>
  <li>[Дело 2]</li>
</ul>`,
    tags: ['дневник', 'личное'],
    color: 'bg-orange-100',
    icon: 'book',
  }
];

// Функция для получения шаблона по ID
export function getTemplateById(id: string): NoteTemplate | undefined {
  return DEFAULT_TEMPLATES.find(template => template.id === id);
}

// Функция для применения шаблона к заметке
export function applyTemplate(template: NoteTemplate, title?: string): {
  title: string;
  content: string;
  tags: string[];
  color?: string;
} {
  return {
    title: title || template.name,
    content: template.content,
    tags: [...template.tags],
    color: template.color
  };
}
