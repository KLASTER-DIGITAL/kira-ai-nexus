
import { useCallback } from 'react';
import { Editor } from '@tiptap/react';
import { useNotesMutations } from '../useNotesMutations';
import { WikiLinkItem } from '@/components/notes/extensions/wiki-link/types';
import { useNotes } from "../../useNotes";
import { useWikiLinkCreation } from './useWikiLinkCreation';
import { useWikiLinkValidation } from './useWikiLinkValidation';
import { useWikiLinkNavigation } from './useWikiLinkNavigation';
import { useWikiLinkSuggestions } from './useWikiLinkSuggestions';

/**
 * Hook for handling wiki links in notes
 */
export const useWikiLinks = (noteId?: string, onNoteCreated?: (noteId: string) => void) => {
  const { notes } = useNotes({ pageSize: 100 });
  
  // Specialized hooks for different wiki link functionalities
  const { handleCreateNote } = useWikiLinkCreation(onNoteCreated);
  const { validateWikiLink, validateLinks } = useWikiLinkValidation(notes);
  const { handleWikiLinkClick } = useWikiLinkNavigation();
  const { fetchNotesForSuggestion } = useWikiLinkSuggestions(notes);

  /**
   * Process wiki links in the editor and extract them
   */
  const processWikiLinks = useCallback((editor: Editor) => {
    // This would extract and process wiki links from the editor content
    // Functionality can be extended later if needed
  }, []);

  return {
    handleCreateNote,
    validateWikiLink,
    processWikiLinks,
    handleWikiLinkClick,
    fetchNotesForSuggestion,
    validateLinks,
    notes // Add notes to the return value for TipTapMenuBar
  };
};
