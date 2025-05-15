
import { useCallback } from 'react';
import { Note } from '@/types/notes';
import { WikiLinkItem } from '@/components/notes/extensions/wiki-link/types';

/**
 * Hook for providing suggestions for wiki links
 */
export const useWikiLinkSuggestions = (notes: Note[] | undefined) => {
  /**
   * Fetch notes for wiki link suggestion dropdown
   */
  const fetchNotesForSuggestion = useCallback(async (query: string): Promise<WikiLinkItem[]> => {
    if (!notes) return [];

    return notes
      .filter(note => note.title.toLowerCase().includes(query.toLowerCase()))
      .map((note, index) => ({
        id: note.id,
        title: note.title,
        index
      }))
      .slice(0, 5);
  }, [notes]);

  return { fetchNotesForSuggestion };
};
