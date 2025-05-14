
import { Editor } from '@tiptap/react';

/**
 * Helper function to add click handlers for wiki links in read-only mode
 */
export const addWikiLinkClickHandlers = (
  editor: Editor, 
  handleClick: (href: string) => void
): (() => void) => {
  if (!editor) return () => {};
  
  const handleClickEvent = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.matches('.wiki-link') || target.closest('.wiki-link')) {
      const wikiLink = target.closest('.wiki-link') as HTMLElement;
      if (wikiLink) {
        const href = wikiLink.getAttribute('href');
        if (href) {
          event.preventDefault();
          handleClick(href);
        }
      }
    }
  };
  
  const editorElement = editor.view.dom;
  editorElement.addEventListener('click', handleClickEvent);
  
  // Return cleanup function
  return () => {
    editorElement.removeEventListener('click', handleClickEvent);
  };
};
