
import { Extension } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';

export interface TagSuggestionOptions {
  suggestion: {
    items: string[];
    render: () => any;
  };
}

export const TagSuggestion = Extension.create<TagSuggestionOptions>({
  name: 'tagSuggestion',
  
  addOptions() {
    return {
      suggestion: {
        items: [],
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
