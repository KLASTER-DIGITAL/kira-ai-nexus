
import { Extension } from '@tiptap/core';
import { Plugin } from '@tiptap/pm/state';
import Suggestion, { SuggestionOptions } from '@tiptap/suggestion';
import { Editor } from '@tiptap/react';

export interface TagSuggestionOptions {
  suggestion: Partial<SuggestionOptions>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    tagSuggestion: {
      setTag: (tag: string) => ReturnType;
    };
  }
}

export const TagSuggestion = Extension.create<TagSuggestionOptions>({
  name: 'tagSuggestion',

  addOptions() {
    return {
      suggestion: {},
    };
  },

  addCommands() {
    return {
      setTag: (tag: string) => ({ commands }) => {
        return commands.insertContent(`#${tag} `);
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
