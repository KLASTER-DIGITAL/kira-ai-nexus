
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
      'Mod-Shift-8': () => this.editor.commands.toggleTaskList(),
    };
  },
  
  addCommands() {
    return {
      toggleTaskList: () => ({ commands }) => {
        return commands.toggleList('taskList', 'taskItem');
      }
    };
  },
});

export default TaskList;
