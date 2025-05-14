
import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';
import { Extension } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';

interface SuggestionItem {
  id: string;
  title: string;
  index: number;
  type?: 'existing' | 'create';
}

interface SuggestionProps {
  items: SuggestionItem[];
  command: (props: { id: string; title: string }) => void;
  editor: any;
  range: any;
}

class WikiLinkSuggestionList {
  items: SuggestionItem[];
  command: (props: { id: string; title: string }) => void;
  editor: any;
  range: any;
  element: HTMLElement;
  scrollHandler: any;
  selectIndex: number;

  constructor({ items, command, editor, range }: SuggestionProps) {
    this.items = items;
    this.command = command;
    this.editor = editor;
    this.range = range;
    this.selectIndex = 0;

    this.element = document.createElement('div');
    this.element.className = 'wiki-link-suggestion';
    this.element.innerHTML = `
      <div class="items"></div>
    `;

    this.renderItems();

    this.scrollHandler = this.handleScroll.bind(this);
    this.element.addEventListener('scroll', this.scrollHandler);
  }

  renderItems() {
    const itemsContainer = this.element.querySelector('.items');
    if (!itemsContainer) return;

    itemsContainer.innerHTML = '';

    if (this.items.length === 0) {
      const noResults = document.createElement('div');
      noResults.className = 'no-results';
      noResults.textContent = 'Нет результатов';
      itemsContainer.appendChild(noResults);
      return;
    }

    this.items.forEach((item, index) => {
      const button = document.createElement('button');
      button.className = 'item';
      button.innerHTML = `
        <div class="title">${item.type === 'create' ? '➕ Создать: ' : ''}${this.highlight(item.title)}</div>
      `;
      button.setAttribute('data-index', String(index));
      
      // Handle selection
      if (index === this.selectIndex) {
        button.setAttribute('aria-selected', 'true');
      }
      
      button.addEventListener('click', () => {
        this.selectItem(index);
      });
      
      button.addEventListener('mousemove', () => {
        this.selectIndex = index;
        this.updateSelect();
      });
      
      itemsContainer.appendChild(button);
    });
  }

  highlight(text: string) {
    // This is a simple implementation, you might want to enhance it
    return text;
  }

  selectItem(index: number) {
    const item = this.items[index];
    
    if (item) {
      this.command({
        id: item.id,
        title: item.title
      });
    }
  }

  updateSelect() {
    const buttons = Array.from(this.element.querySelectorAll('.item'));
    
    buttons.forEach((button, index) => {
      if (index === this.selectIndex) {
        button.setAttribute('aria-selected', 'true');
      } else {
        button.removeAttribute('aria-selected');
      }
    });
  }

  onKeyDown({ event }: { event: KeyboardEvent }) {
    if (event.key === 'ArrowDown') {
      this.selectIndex = (this.selectIndex + 1) % this.items.length;
      this.updateSelect();
      return true;
    }
    
    if (event.key === 'ArrowUp') {
      this.selectIndex = (this.selectIndex + this.items.length - 1) % this.items.length;
      this.updateSelect();
      return true;
    }
    
    if (event.key === 'Enter') {
      this.selectItem(this.selectIndex);
      return true;
    }
    
    return false;
  }

  handleScroll() {
    // Handle scroll events if needed
  }

  destroy() {
    this.element.removeEventListener('scroll', this.scrollHandler);
  }
}

export const WikiLinkSuggest = Extension.create({
  name: 'wikiLinkSuggest',

  defaultOptions: {
    suggestion: {
      char: '[[',
      allowSpaces: true,
      startOfLine: false,
      isolating: false,

      // This is the function that will be called when user types [[ in the editor
      // It should return items for the suggestion list
      items: ({ query }: { query: string }) => {
        return [
          {
            id: 'create',
            title: query,
            index: 0,
            type: 'create'
          }
        ];
      },

      // This callback is triggered when a suggestion is clicked
      command: ({ editor, range, props }: any) => {
        // Override default behavior
      },

      render: () => {
        let component: { destroy: () => void };
        let popup: any;

        return {
          onStart: (props: SuggestionProps) => {
            component = new ReactRenderer(WikiLinkSuggestionList, {
              props,
              editor: props.editor,
            });

            popup = tippy('body', {
              getReferenceClientRect: props.clientRect,
              appendTo: () => document.body,
              content: component.element,
              showOnCreate: true,
              interactive: true,
              trigger: 'manual',
              placement: 'bottom-start',
              theme: 'wiki-link-suggestion',
            })[0];
          },

          onUpdate(props: SuggestionProps) {
            component.updateProps(props);

            popup?.setProps({
              getReferenceClientRect: props.clientRect,
            });
          },

          onKeyDown(props: { event: KeyboardEvent }) {
            if (component.ref) {
              return component.ref.onKeyDown(props);
            }

            return false;
          },

          onExit() {
            popup?.destroy();
            component.destroy();
          },
        };
      },
    },
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
