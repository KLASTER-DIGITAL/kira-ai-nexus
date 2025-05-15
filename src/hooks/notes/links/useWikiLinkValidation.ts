
import { useCallback } from 'react';
import { Editor } from '@tiptap/react';
import { Note } from '@/types/notes';

/**
 * Hook for validating wiki links
 */
export const useWikiLinkValidation = (notes: Note[] | undefined) => {
  /**
   * Validate if a wiki link refers to a valid note
   */
  const validateWikiLink = useCallback((href: string): boolean => {
    if (!notes) return false;
    return notes.some(note => note.id === href);
  }, [notes]);

  /**
   * Validate all wiki links in the editor content
   */
  const validateLinks = useCallback((editor: Editor) => {
    if (!editor) return;
    
    // Find all wiki links in the document and validate them
    editor.state.doc.descendants((node, pos) => {
      if (node.type.name === 'wikiLink') {
        const href = node.attrs.href;
        const isValid = validateWikiLink(href);
        
        // Update link validity if needed
        if (node.attrs.isValid !== isValid) {
          // Use a transaction to update the node attributes
          editor.commands.updateAttributes('wikiLink', { 
            href: href,
            isValid: isValid
          });
        }
        return false; // continue traversing
      }
      return false;
    });
  }, [validateWikiLink]);

  return { validateWikiLink, validateLinks };
};
