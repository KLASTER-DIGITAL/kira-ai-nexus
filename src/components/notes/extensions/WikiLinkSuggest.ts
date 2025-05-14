import { Extension } from '@tiptap/core';
import Suggestion, { SuggestionOptions } from '@tiptap/suggestion';
import tippy from 'tippy.js';
import { PluginKey } from '@tiptap/pm/state';

type WikiLinkSuggestionOptions = {
  suggestion: Partial<SuggestionOptions>;
};

export const WikiLinkSuggest = Extension.create<WikiLinkSuggestionOptions>({
  name: 'wikiLinkSuggest',

  defaultOptions: {
    suggestion: {
      char: '[[',
      allowSpaces: true,
      command: ({ editor, range, props }) => {
        const nodeAfter = editor.view.state.selection.$to.nodeAfter;
        const overrideSpace = nodeAfter?.text?.startsWith(' ');
        
        if (overrideSpace) {
          range.to += 1;
        }

        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setWikiLink({ href: props.id, label: props.title })
          .run();
      },
    },
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
        pluginKey: new PluginKey('wikiLinkSuggest'),
        items: ({ query }) => {
          return this.options.suggestion.items?.({ query }) || [];
        },
        render: () => {
          let component;
          let popup;

          return {
            onStart: (props) => {
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
                theme: 'wiki-link-suggestion',
              })[0];
            },

            onUpdate(props) {
              if (!component || !popup) {
                return;
              }

              const items = props.items.map(item => {
                return `<button class="item" data-index="${item.index}">${item.title}</button>`;
              }).join('');

              component.querySelector('.items').innerHTML = items;

              component.querySelectorAll('.item').forEach((button, index) => {
                button.addEventListener('click', () => {
                  props.command(props.items[index]);
                  popup.hide();
                });

                button.addEventListener('mouseenter', () => {
                  props.setSelectionAt(index);
                });
              });

              popup.setProps({
                getReferenceClientRect: props.clientRect,
              });
            },

            onKeyDown(props) {
              if (props.event.key === 'Escape') {
                popup?.hide();
                return true;
              }

              if (props.event.key === 'Enter') {
                const index = props.event.shiftKey
                  ? props.items.length - 1
                  : 0;

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
                props.setSelectionAt(prevIndex < 0 ? props.items.length - 1 : prevIndex);
                return true;
              }

              if (props.event.key === 'ArrowDown') {
                popup?.show();
                props.setSelectionAt((props.selectedIndex || 0) + 1 >= props.items.length
                  ? 0 
                  : (props.selectedIndex || 0) + 1);
                return true;
              }

              return false;
            },

            onExit() {
              popup?.destroy();
            },
          };
        },
      }),
    ];
  },
});
