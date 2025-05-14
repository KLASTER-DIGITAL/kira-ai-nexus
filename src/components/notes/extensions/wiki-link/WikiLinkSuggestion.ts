
import React from 'react';
import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';
import Suggestion from '@tiptap/suggestion';
import WikiLinkSuggestList from './WikiLinkSuggestList';

export interface WikiLinkItem {
  id: string;
  title: string;
  index: number;
}

type FetchWikiLinkSuggestions = (query: string) => Promise<WikiLinkItem[]>;
type CreateWikiLink = (title: string) => Promise<{ id: string; title: string; type: string }>;

// Function to create a WikiLink suggestion plugin
export const createWikiLinkSuggestion = (
  fetchSuggestions: FetchWikiLinkSuggestions,
  createNoteCallback: CreateWikiLink
) => {
  return Suggestion.configure({
    char: '[[',
    allowSpaces: true,
    allowedPrefixes: [' ', '\n', null],
    startOfLine: false,
    
    async items({ query }) {
      if (query.length === 0) return [];
      
      try {
        const items = await fetchSuggestions(query);
        return items;
      } catch (error) {
        console.error('Error fetching wiki link suggestions:', error);
        return [];
      }
    },
    
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
  });
};

// Export a named component for compatibility with existing imports
export const WikiLinkSuggestionList = WikiLinkSuggestList;
