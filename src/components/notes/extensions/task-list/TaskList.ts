
import { Node, mergeAttributes } from '@tiptap/core';

export interface TaskListOptions {
  HTMLAttributes: Record<string, any>;
}

export const TaskList = Node.create<TaskListOptions>({
  name: 'taskList',
  
  defaultOptions: {
    HTMLAttributes: {},
  },
  
  group: 'block',
  
  content: 'taskItem+',
  
  parseHTML() {
    return [
      {
        tag: 'ul[data-type="taskList"]',
      },
    ];
  },
  
  renderHTML({ HTMLAttributes }) {
    return [
      'ul',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-type': 'taskList',
        class: 'task-list',
      }),
      0,
    ];
  },
  
  addKeyboardShortcuts() {
    return {
      'Mod-Shift-8': () => this.editor.commands.toggleList('taskList', 'taskItem'),
    };
  },
  
  addCommands() {
    // We need to ensure we're returning a proper command format
    // that matches what TipTap expects for Partial<RawCommands>
    return {
      // Use TipTap's expected command format for toggleList
      toggleList: () => ({ commands }) => {
        // This implementation will run when our specific task list is needed
        return commands.toggleList('taskList', 'taskItem');
      }
    };
  },
});

export default TaskList;
