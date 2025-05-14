
import { Editor } from '@tiptap/core';
import { SuggestionProps } from '@tiptap/suggestion';
import { PluginKey } from '@tiptap/pm/state';
import tippy from 'tippy.js';

interface WikiLinkItem {
  id: string;
  title: string;
  index: number;
  type: string;
  isNew?: boolean;
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
          ${items.length > 0 ? items.map(item => `
            <button class="item ${item.isNew ? 'new-item' : ''}" data-index="${item.index}">
              ${item.isNew ? '+ Create' : ''} ${item.title}
            </button>
          `).join('') : '<div class="no-results">No matching notes found</div>'}
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
      itemsContainer.innerHTML = items.length > 0 ? items.map(item => `
        <button class="item ${item.isNew ? 'new-item' : ''}" data-index="${item.index}">
          ${item.isNew ? '+ Create' : ''} ${item.title}
        </button>
      `).join('') : '<div class="no-results">No matching notes found</div>';

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
  editor: Editor,
  onCreateNote?: (title: string) => Promise<WikiLinkItem>
) => {
  const getSuggestions = async ({ query }: { query: string }) => {
    if (!query) {
      return [];
    }

    try {
      // Fetch existing notes matching the query
      const items = await fetchNotes(query);
      
      // Map items with indices
      const mappedItems = items.map((item, index) => ({
        ...item,
        index,
      }));
      
      // If we have no exact match and we can create notes, add a "create new" option
      if (onCreateNote && 
          query.length >= 2 && 
          !items.some(note => note.title.toLowerCase() === query.toLowerCase())) {
        mappedItems.push({
          id: `new-${query}`,
          title: query,
          index: mappedItems.length,
          type: 'note',
          isNew: true,
        });
      }
      
      return mappedItems;
    } catch (error) {
      console.error('Error fetching wiki link suggestions:', error);
      return [];
    }
  };

  // Create a renderer for the suggestion dropdown
  const renderItems = () => {
    let component: WikiLinkSuggestionList | null = null;
    let popup: any = null;

    return {
      onStart: (props: SuggestionProps) => {
        component = new WikiLinkSuggestionList({
          items: props.items,
          command: props.command,
        });

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
          theme: 'wiki-link-suggestion',
        });
      },

      onUpdate: (props: SuggestionProps) => {
        if (!component) return;
        
        component.updateItems(props.items);

        if (!props.clientRect) {
          return;
        }

        if (popup && popup[0]) {
          popup[0].setProps({
            getReferenceClientRect: props.clientRect,
          });
        }
      },

      onKeyDown: (props: { event: KeyboardEvent }) => {
        if (props.event.key === 'Escape') {
          if (popup && popup[0]) {
            popup[0].hide();
          }
          return true;
        }

        return false;
      },

      onExit: () => {
        if (popup && popup[0]) {
          popup[0].destroy();
        }
        component = null;
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
    command: async ({ editor, range, props }) => {
      // Check if this is a new note to be created
      if (props.isNew && onCreateNote) {
        try {
          // Create the new note and get its ID
          const newNote = await onCreateNote(props.title);
          
          // Delete the suggestion placeholder
          editor
            .chain()
            .deleteRange(range)
            .setWikiLink({
              href: newNote.id,
              label: newNote.title,
              isValid: true
            })
            .run();
        } catch (error) {
          console.error('Error creating new note:', error);
          
          // If creation fails, insert as invalid link
          editor
            .chain()
            .deleteRange(range)
            .setWikiLink({
              href: props.title,
              label: props.title,
              isValid: false
            })
            .run();
        }
      } else {
        // Regular link to existing note
        // Delete the suggestion placeholder
        editor
          .chain()
          .deleteRange(range)
          .setWikiLink({
            href: props.id,
            label: props.title,
            isValid: true
          })
          .run();
      }
    },
    render: renderItems,
    editor,
    pluginKey: wikiLinkPluginKey,
  };
};
