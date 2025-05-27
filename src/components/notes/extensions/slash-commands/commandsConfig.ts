
import { SlashCommandItem } from './SlashCommands';
import { Editor } from '@tiptap/react';

export const createSlashCommands = (editor: Editor): SlashCommandItem[] => [
  {
    title: 'Заголовок 1',
    description: 'Большой заголовок раздела',
    icon: '📰',
    command: ({ editor, range }: { editor: Editor; range: any }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run();
    },
    aliases: ['h1', 'heading1'],
  },
  {
    title: 'Заголовок 2',
    description: 'Средний заголовок подраздела',
    icon: '📰',
    command: ({ editor, range }: { editor: Editor; range: any }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run();
    },
    aliases: ['h2', 'heading2'],
  },
  {
    title: 'Заголовок 3',
    description: 'Малый заголовок',
    icon: '📰',
    command: ({ editor, range }: { editor: Editor; range: any }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run();
    },
    aliases: ['h3', 'heading3'],
  },
  {
    title: 'Список',
    description: 'Создать маркированный список',
    icon: '•',
    command: ({ editor, range }: { editor: Editor; range: any }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
    aliases: ['ul', 'list'],
  },
  {
    title: 'Нумерованный список',
    description: 'Создать нумерованный список',
    icon: '1.',
    command: ({ editor, range }: { editor: Editor; range: any }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
    aliases: ['ol', 'numbered'],
  },
  {
    title: 'Список задач',
    description: 'Создать список с чекбоксами',
    icon: '☑️',
    command: ({ editor, range }: { editor: Editor; range: any }) => {
      editor.chain().focus().deleteRange(range).toggleList('taskList', 'taskItem').run();
    },
    aliases: ['todo', 'checklist', 'tasks'],
  },
  {
    title: 'Цитата',
    description: 'Выделить текст как цитату',
    icon: '"',
    command: ({ editor, range }: { editor: Editor; range: any }) => {
      editor.chain().focus().deleteRange(range).setBlockquote().run();
    },
    aliases: ['quote', 'blockquote'],
  },
  {
    title: 'Код',
    description: 'Блок кода с подсветкой',
    icon: '💻',
    command: ({ editor, range }: { editor: Editor; range: any }) => {
      editor.chain().focus().deleteRange(range).setCodeBlock().run();
    },
    aliases: ['code', 'codeblock'],
  },
  {
    title: 'Разделитель',
    description: 'Визуальный разделитель',
    icon: '---',
    command: ({ editor, range }: { editor: Editor; range: any }) => {
      editor.chain().focus().deleteRange(range).setHorizontalRule().run();
    },
    aliases: ['hr', 'divider'],
  },
  {
    title: 'Инфо блок',
    description: 'Выделенный информационный блок',
    icon: '💡',
    command: ({ editor, range }: { editor: Editor; range: any }) => {
      editor.chain().focus().deleteRange(range).setCallout({ type: 'info' }).run();
    },
    aliases: ['callout', 'info'],
  },
  {
    title: 'Предупреждение',
    description: 'Блок с предупреждением',
    icon: '⚠️',
    command: ({ editor, range }: { editor: Editor; range: any }) => {
      editor.chain().focus().deleteRange(range).setCallout({ type: 'warning' }).run();
    },
    aliases: ['warning', 'warn'],
  },
  {
    title: 'Успех',
    description: 'Блок с успешным сообщением',
    icon: '✅',
    command: ({ editor, range }: { editor: Editor; range: any }) => {
      editor.chain().focus().deleteRange(range).setCallout({ type: 'success' }).run();
    },
    aliases: ['success', 'done'],
  },
  {
    title: 'Ошибка',
    description: 'Блок с сообщением об ошибке',
    icon: '❌',
    command: ({ editor, range }: { editor: Editor; range: any }) => {
      editor.chain().focus().deleteRange(range).setCallout({ type: 'error' }).run();
    },
    aliases: ['error', 'danger'],
  },
];
