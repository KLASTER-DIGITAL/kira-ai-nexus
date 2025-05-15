
import tippy from 'tippy.js';
import { wikiLinkPluginKey } from './types';
import WikiLinkSuggestionList from './WikiLinkSuggestList';
import { WikiLinkItem } from './types';

export const createWikiLinkSuggestion = (
  fetchNotes: (query: string) => Promise<WikiLinkItem[]>,
  onCreateNote?: (title: string) => Promise<WikiLinkItem>
) => {
  return {
    char: '[[',
    allowSpaces: true,
    startOfLine: false,
    isolating: true,
    pluginKey: wikiLinkPluginKey,
    
    items: async ({ query }: { query: string }) => {
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
    },

    render: () => {
      let component: WikiLinkSuggestionList | null = null;
      let popup: any = null;

      return {
        onStart: (props: any) => {
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

        onUpdate: (props: any) => {
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
    },

    command: async ({ editor, range, props }: any) => {
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
  };
};
