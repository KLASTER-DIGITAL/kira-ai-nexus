
import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';
import Suggestion from '@tiptap/suggestion';
import { PluginKey } from '@tiptap/pm/state';
import WikiLinkSuggestList from './WikiLinkSuggestList';

// Define type for wiki link items in the suggestion dropdown
export interface WikiLinkItem {
  id: string;
  title: string;
  index: number;
}

/**
 * Create a suggestion configuration for wiki links
 */
export const createWikiLinkSuggestion = (
  fetchNotesForSuggestion: (query: string) => Promise<WikiLinkItem[]>,
  handleCreateNote: (title: string) => Promise<{ id: string; title: string; type: string }>
) => {
  const suggestionKey = new PluginKey('wikiLinkSuggestion');

  return Suggestion.configure({
    editor: null,
    char: '[[',
    allowSpaces: true,
    startOfLine: false,
    decorationTag: 'span',
    decorationClass: 'wiki-link-suggestion',
    command: ({ editor, range, props }) => {
      // Delete the suggestion placeholder
      editor.commands.deleteRange(range);

      // Insert wiki link
      const id = props.id || '';
      const title = props.title || '';
      editor.commands.insertContent(`[[${title}|${id}]]`);
    },
    items: async ({ query }) => {
      if (!query) return [];

      try {
        return await fetchNotesForSuggestion(query);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        return [];
      }
    },
    render: () => {
      let component: ReactRenderer | null = null;
      let popup: any | null = null;

      return {
        onStart: (props) => {
          component = new ReactRenderer(WikiLinkSuggestList, {
            props,
            editor: props.editor,
          });

          // Create tippy tooltip with suggestions list
          popup = tippy('body', {
            getReferenceClientRect: props.clientRect,
            appendTo: () => document.body,
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: 'manual',
            placement: 'bottom-start',
            arrow: false,
          });
        },
        onUpdate: (props) => {
          if (!component) return;

          component.updateProps(props);

          popup?.[0].setProps({
            getReferenceClientRect: props.clientRect,
          });
        },
        onKeyDown: (props) => {
          if (!component || !popup?.[0]) return false;

          // Handle arrow navigation in the dropdown
          if (props.event.key === 'ArrowUp') {
            component.ref?.onKeyUp();
            return true;
          }
          if (props.event.key === 'ArrowDown') {
            component.ref?.onKeyDown();
            return true;
          }
          if (props.event.key === 'Enter') {
            component.ref?.onEnter();
            return true;
          }
          if (props.event.key === 'Escape') {
            popup[0].hide();
            return true;
          }

          return false;
        },
        onExit: () => {
          if (popup?.[0]) {
            popup[0].destroy();
            popup = null;
          }

          if (component) {
            component.destroy();
            component = null;
          }
        },
      };
    },
  });
};
