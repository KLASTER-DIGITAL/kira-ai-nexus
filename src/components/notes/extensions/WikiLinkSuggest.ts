import { Extension } from '@tiptap/core';
import { SuggestionOptions } from '@tiptap/suggestion';
import tippy from 'tippy.js';
import { PluginKey } from '@tiptap/pm/state';

export const WikiLinkSuggest = Extension.create({
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
          return this.options.suggestion.items?.({ query }) || [];
        }
      }
    };
  },
  
  addProseMirrorPlugins() {
    const suggestion: SuggestionOptions = this.options.suggestion;

    return [
      new PluginKey('wikiLinkSuggest'),
      {
        key: new PluginKey('wikiLinkSuggest'),
        view: () => {
          return {
            update: (view) => {
              const { editor } = view;

              if (!editor.isFocused) {
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
        
        
        
      }
    ];
  }
});
