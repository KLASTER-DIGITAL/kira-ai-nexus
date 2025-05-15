
import { Extension } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';

export interface TagSuggestionOptions {
  suggestion: {
    items: (props: { query: string; editor: any }) => string[] | Promise<string[]>;
    render: () => any;
  };
}

export const TagSuggestion = Extension.create<TagSuggestionOptions>({
  name: 'tagSuggestion',
  
  addOptions() {
    return {
      suggestion: {
        items: ({ query }: { query: string; editor: any }) => {
          return [];  // Default empty array, will be overridden by config
        },
        render: () => ({}),
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
