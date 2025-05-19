
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
    // The issue is here - we need to ensure we're returning a proper command format
    // that matches what TipTap expects for Partial<RawCommands>
    return {
      // We need to use the same name as in the original toggleList command
      toggleList: ({ typeOrName, itemTypeOrName }) => {
        if (typeOrName === 'taskList' && itemTypeOrName === 'taskItem') {
          return ({ commands }) => {
            return commands.toggleList('taskList', 'taskItem');
          };
        }
        
        return () => false;
      },
    };
  },
});

export default TaskList;
