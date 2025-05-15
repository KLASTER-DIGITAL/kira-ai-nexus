
import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';
import WikiLinkSuggestList from './WikiLinkSuggestList';
import { FetchWikiLinkSuggestions, CreateWikiLink } from './types';

/**
 * Creates a wiki link suggestion configuration for TipTap
 */
export const createWikiLinkSuggestion = (
  fetchSuggestions: FetchWikiLinkSuggestions,
  createNoteCallback: CreateWikiLink
) => {
  return {
    editor: undefined, // Will be set by TipTap when the extension is used
    char: '[[',
    allowSpaces: true,
    allowedPrefixes: [' ', '\n', null],
    startOfLine: false,
    
    // Fetch suggestions based on query
    items: async ({ query, editor }) => {
      if (query.length === 0) return [];
      
      try {
        const items = await fetchSuggestions(query);
        return items;
      } catch (error) {
        console.error('Error fetching wiki link suggestions:', error);
        return [];
      }
    },
    
    // Render the suggestion dropdown
    render() {
      let component: ReactRenderer;
      let popup: any;
      
      return {
        onStart: (props) => {
          component = new ReactRenderer(WikiLinkSuggestList, {
            props: {
              ...props,
              createNoteCallback
            },
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
          });
        },
        
        onUpdate(props) {
          component.updateProps({
            ...props,
            createNoteCallback
          });
          
          popup[0].setProps({
            getReferenceClientRect: props.clientRect,
          });
        },
        
        onKeyDown(props) {
          if (props.event.key === 'Escape') {
            popup[0].hide();
            return true;
          }
          
          // Type-safe reference access
          const ref = component.ref as any;
          if (ref && typeof ref.onKeyDown === 'function') {
            return ref.onKeyDown(props);
          }
          
          return false;
        },
        
        onKeyUp(props) {
          // Type-safe reference access
          const ref = component.ref as any;
          if (ref && typeof ref.onKeyUp === 'function') {
            return ref.onKeyUp(props);
          }
          
          return false;
        },

        onExit() {
          if (popup && popup[0]) {
            popup[0].destroy();
          }
          if (component) {
            component.destroy();
          }
        },
      };
    },
    
    // Execute command when a suggestion is selected
    command: ({ editor, range, props }) => {
      const nodeAfter = editor.view.state.selection.$to.nodeAfter;
      const text = nodeAfter?.text ?? '';
      
      let to = range.to;
      let removeText = ']]';
      
      if (text && text.startsWith(']]')) {
        to += 2;
        removeText = '';
      }
      
      // Replace the suggestion with actual wiki link
      editor
        .chain()
        .focus()
        .deleteRange({ from: range.from, to })
        .insertContent([
          {
            type: 'wikiLink',
            attrs: {
              href: props.id,
              title: props.title
            }
          },
          {
            type: 'text',
            text: removeText
          }
        ])
        .run();
    }
  };
};
