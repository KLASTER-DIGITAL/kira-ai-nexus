
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
    return {
      // Fixed the command to use correct return type format
      toggleTaskList: () => {
        return ({ commands }) => {
          return commands.toggleList('taskList', 'taskItem');
        };
      },
    };
  },
});

export default TaskList;
