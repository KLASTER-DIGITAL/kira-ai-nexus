
import { Extension } from '@tiptap/core';
import Suggestion, { SuggestionOptions } from '@tiptap/suggestion';

export interface TagSuggestionOptions {
  suggestion: Partial<SuggestionOptions>;
}

export const TagSuggestion = Extension.create<TagSuggestionOptions>({
  name: 'tagSuggestion',

  addOptions() {
    return {
      suggestion: {
        char: '#',
        allowSpaces: true,
        command: ({ editor, range, props }) => {
          // Default command implementation
          console.log('Tag selected:', props);
        },
        items: ({ query }) => {
          return []; // Default empty array, will be overridden by config
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});
