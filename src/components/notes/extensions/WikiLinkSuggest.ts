
import { ReactRenderer } from '@tiptap/react';
import { Editor } from '@tiptap/core';
import tippy from 'tippy.js';
import { SuggestionProps, SuggestionOptions } from '@tiptap/suggestion';
import { PluginKey } from '@tiptap/pm/state';

interface WikiLinkItem {
  id: string;
  title: string;
  index: number;
  type: string;
}

interface WikiLinkSuggestionListProps {
  items: WikiLinkItem[];
  command: (item: WikiLinkItem) => void;
}

class WikiLinkSuggestionList {
  element: HTMLElement;
  items: WikiLinkItem[];
  command: (item: WikiLinkItem) => void;

  constructor({ items, command }: WikiLinkSuggestionListProps) {
    this.items = items;
    this.command = command;
    this.element = document.createElement('div');
    this.element.className = 'tippy-box wiki-links-dropdown';
    this.element.innerHTML = `
      <div class="tippy-content">
        <div class="items">
          ${items.map(item => `
            <button class="item" data-index="${item.index}">
              ${item.title}
            </button>
          `).join('')}
        </div>
      </div>
    `;

    // Add click event listeners
    const buttons = this.element.querySelectorAll('button');
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const index = parseInt(button.dataset.index || '0', 10);
        const item = this.items[index];
        if (item) {
          this.command(item);
        }
      });
    });
  }

  selectItem(index: number) {
    const item = this.items[index];
    if (item) {
      this.command(item);
    }
  }

  updateItems(items: WikiLinkItem[]) {
    this.items = items;
    // Update the DOM to reflect new items
    const itemsContainer = this.element.querySelector('.items');
    if (itemsContainer) {
      itemsContainer.innerHTML = items.map(item => `
        <button class="item" data-index="${item.index}">
          ${item.title}
        </button>
      `).join('');

      // Re-add click event listeners
      const buttons = this.element.querySelectorAll('button');
      buttons.forEach((button) => {
        button.addEventListener('click', () => {
          const index = parseInt(button.dataset.index || '0', 10);
          const item = this.items[index];
          if (item) {
            this.command(item);
          }
        });
      });
    }
  }
}

// Create a suggestion plugin key
export const wikiLinkPluginKey = new PluginKey('wiki-link-suggestion');

export const WikiLinkSuggest = (
  fetchNotes: (query: string) => Promise<WikiLinkItem[]>, 
  editor: Editor
) => {
  const getSuggestions = async ({ query }: { query: string }) => {
    if (query.length < 2) {
      return [];
    }

    try {
      const items = await fetchNotes(query);
      return items.map((item, index) => ({
        ...item,
        index, // Add index to each item
      }));
    } catch (error) {
      console.error('Error fetching wiki link suggestions:', error);
      return [];
    }
  };

  // Wrap the ReactRenderer to fit the expected interface
  const renderItems = () => {
    let component: {
      updateProps: (props: WikiLinkSuggestionListProps) => void;
      destroy: () => void;
    };

    let popup: any = null;

    return {
      onStart: (props: SuggestionProps) => {
        component = new ReactRenderer(WikiLinkSuggestionList, {
          props,
          editor: props.editor,
        }) as unknown as { updateProps: (props: WikiLinkSuggestionListProps) => void; destroy: () => void };

        // Create tippy instance
        if (!props.clientRect) {
          return;
        }

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        });
      },

      onUpdate: (props: SuggestionProps) => {
        component.updateProps(props as unknown as WikiLinkSuggestionListProps);

        if (!props.clientRect) {
          return;
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
      },

      onKeyDown: (props: { event: KeyboardEvent }) => {
        if (props.event.key === 'Escape') {
          popup[0].hide();
          return true;
        }

        return false;
      },

      onExit: () => {
        if (popup && popup[0]) {
          popup[0].destroy();
        }
        component.destroy();
      },
    };
  };

  // Return the suggestion configuration
  return {
    char: '[[',
    allowSpaces: true,
    startOfLine: false,
    isolating: true,
    items: getSuggestions,
    command: ({ editor, range, props }) => {
      // Delete the suggestion placeholder
      editor
        .chain()
        .deleteRange(range)
        .insertContent(`[[${props.title}]]`)
        .run();
    },
    render: renderItems,
    editor,
    pluginKey: wikiLinkPluginKey,
  };
};
