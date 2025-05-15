
import { useState, useCallback } from 'react';
import { useNoteLinks } from '@/hooks/notes/useNoteLinks';

export const useWikiLinks = (
  noteId?: string,
  onNoteCreated?: (noteId: string) => void
) => {
  const [isCreating, setIsCreating] = useState(false);
  const { allNotes } = useNoteLinks(noteId);

  // Handle clicking a wiki link
  const handleWikiLinkClick = useCallback((href: string, onLinkClick?: (noteId: string) => void) => {
    if (!href) return;

    // Extract the note ID from the href (assuming href format is "note/[id]")
    const noteId = href.replace('note/', '');

    if (onLinkClick) {
      onLinkClick(noteId);
    }
  }, []);

  return {
    allNotes,
    isCreating,
    handleWikiLinkClick
  };
};
