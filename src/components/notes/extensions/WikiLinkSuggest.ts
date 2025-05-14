
import { Extension } from '@tiptap/core';
import { SuggestionOptions, SuggestionProps, Suggestion } from '@tiptap/suggestion';
import tippy from 'tippy.js';
import { PluginKey } from '@tiptap/pm/state';

export interface WikiLinkItem {
  id: string;
  title: string;
  index: number;
}

export const WikiLinkSuggest = Extension.create({
  name: 'wikiLinkSuggest',

  defaultOptions: {
    suggestion: {
      char: '[[',
      allowSpaces: true,
      command: ({ editor, range, props }: any) => {
        const nodeAfter = editor.view.state.selection.$to.nodeAfter;
        const overrideSpace = nodeAfter?.text?.startsWith(' ');

        if (overrideSpace) {
          range.to += 1;
        }

        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setWikiLink({
            href: props.id,
            label: props.title
          })
          .run();
      },
      items: ({ query, editor }: { query: string; editor: any }) => {
        // This function needs to be overridden by the user
        return [];
      },
    },
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
        pluginKey: new PluginKey('wikiLinkSuggest'),
        items: (props) => {
          return this.options.suggestion.items?.({
            query: props.query,
            editor: this.editor
          }) || [];
        },
        render: () => {
          let component: HTMLElement;
          let popup: any;

          return {
            onStart: (props: SuggestionProps<WikiLinkItem>) => {
              component = document.createElement('div');
              component.className = 'wiki-link-suggestion';
              component.innerHTML = '<div class="items"></div>';

              popup = tippy('body', {
                getReferenceClientRect: props.clientRect,
                appendTo: () => document.body,
                content: component,
                showOnCreate: true,
                interactive: true,
                trigger: 'manual',
                placement: 'bottom-start',
                arrow: false,
                theme: 'wiki-link-suggestion'
              })[0];
            },

            onUpdate(props: SuggestionProps<WikiLinkItem>) {
              if (!component || !popup) {
                return;
              }

              const items = props.items.map((item) => {
                return `<button class="item" data-index="${item.index}">${item.title}</button>`;
              }).join('');

              component.querySelector('.items')!.innerHTML = items;

              component.querySelectorAll('.item').forEach((button, index) => {
                button.addEventListener('click', () => {
                  props.command(props.items[index]);
                  popup.hide();
                });
              });

              popup.setProps({
                getReferenceClientRect: props.clientRect
              });
            },

            onKeyDown(props: any) {
              if (props.event.key === 'Escape') {
                popup?.hide();
                return true;
              }

              if (props.event.key === 'Enter') {
                const index = props.event.shiftKey ? props.items.length - 1 : 0;
                const item = props.items[props.selectedIndex || index];

                if (item) {
                  props.command(item);
                  popup?.hide();
                }

                return true;
              }

              if (props.event.key === 'ArrowUp') {
                popup?.show();
                
                const prevIndex = (props.selectedIndex || 0) - 1;
                const newIndex = prevIndex < 0 ? props.items.length - 1 : prevIndex;
                
                // Handle selectedIndex in a compatible way
                if (typeof props.setSelectionAt === 'function') {
                  props.setSelectionAt(newIndex);
                }
                
                return true;
              }

              if (props.event.key === 'ArrowDown') {
                popup?.show();
                
                const nextIndex = ((props.selectedIndex || 0) + 1) % props.items.length;
                
                // Handle selectedIndex in a compatible way
                if (typeof props.setSelectionAt === 'function') {
                  props.setSelectionAt(nextIndex);
                }
                
                return true;
              }

              return false;
            },

            onExit() {
              popup?.destroy();
            }
          };
        }
      })
    ];
  }
});
