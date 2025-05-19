
import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import TaskItemView from './TaskItemView';

export interface TaskItemOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    taskItem: {
      /**
       * Toggle a task item
       */
      toggleTaskItem: () => ReturnType;
      /**
       * Set a task item to checked
       */
      setTaskItem: (checked: boolean) => ReturnType;
    };
  }
}

export const TaskItem = Node.create<TaskItemOptions>({
  name: 'taskItem',
  
  defaultOptions: {
    HTMLAttributes: {},
  },
  
  content: 'inline*',
  
  defining: true,
  
  addAttributes() {
    return {
      checked: {
        default: false,
        parseHTML: element => element.getAttribute('data-checked') === 'true',
        renderHTML: attributes => ({
          'data-checked': attributes.checked,
        }),
      },
      priority: {
        default: 'medium',
        parseHTML: element => element.getAttribute('data-priority') || 'medium',
        renderHTML: attributes => ({
          'data-priority': attributes.priority,
        }),
      },
      dueDate: {
        default: null,
        parseHTML: element => element.getAttribute('data-due-date'),
        renderHTML: attributes => ({
          'data-due-date': attributes.dueDate,
        }),
      },
    };
  },
  
  parseHTML() {
    return [
      {
        tag: 'li[data-type="taskItem"]',
        priority: 51,
      },
    ];
  },
  
  renderHTML({ HTMLAttributes }) {
    return [
      'li',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-type': 'taskItem',
      }),
      0,
    ];
  },
  
  addNodeView() {
    return ReactNodeViewRenderer(TaskItemView);
  },
  
  addCommands() {
    return {
      toggleTaskItem:
        () =>
        ({ commands }) => {
          return commands.setTaskItem(!this.editor.getAttributes(this.name).checked);
        },
      setTaskItem:
        (checked: boolean) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, { checked });
        },
    };
  },
  
  addKeyboardShortcuts() {
    return {
      'Enter': () => this.editor.commands.splitListItem(this.name),
      'Shift-Tab': () => this.editor.commands.liftListItem(this.name),
    };
  },
});

export default TaskItem;
