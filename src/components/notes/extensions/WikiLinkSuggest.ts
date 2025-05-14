
import { Extension } from '@tiptap/core';
import { SuggestionOptions } from '@tiptap/suggestion';
import tippy from 'tippy.js';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { EditorView } from '@tiptap/pm/view';

export interface WikiLinkSuggestOptions {
  suggestion: SuggestionOptions;
}

export const WikiLinkSuggest = Extension.create<WikiLinkSuggestOptions>({
  name: 'wikiLinkSuggest',
  
  addOptions() {
    return {
      suggestion: {
        char: '[[',
        allowSpaces: true,
        command: ({ editor, range, props }: any) => {
          const nodeAfter = editor.view.state.selection.$to.nodeAfter;
          const overrideSpace = nodeAfter?.text?.startsWith(' ');
          
          if (overrideSpace) {
            range.to += 1;
          }
          
          editor.chain().focus().deleteRange(range).setWikiLink({
            href: props.id,
            label: props.title
          }).run();
        },
        items: ({ query }: { query: string }) => {
          return this.options.suggestion?.items?.({ query }) || [];
        }
      }
    };
  },
  
  addProseMirrorPlugins() {
    const pluginKey = new PluginKey('wikiLinkSuggest');
    
    return [
      new Plugin({
        key: pluginKey,
        view: () => {
          return {
            update: (view: EditorView) => {
              if (!view.hasFocus()) {
                return;
              }
            },
          };
        },
        props: {
          handleKeyDown: (view, event) => {
            if (event.key === 'Escape') {
              // Return `true` to prevent the event from propagating.
              return true;
            }
            return false;
          },
        },
      })
    ];
  }
});
