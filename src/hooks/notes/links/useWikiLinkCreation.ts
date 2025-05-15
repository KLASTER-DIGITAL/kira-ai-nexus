
import { useCallback } from 'react';
import { useNotesMutations } from '../useNotesMutations';

/**
 * Hook for handling creation of notes from wiki links
 */
export const useWikiLinkCreation = (onNoteCreated?: (noteId: string) => void) => {
  const { createNote } = useNotesMutations();

  /**
   * Create a new note from a wiki link
   */
  const handleCreateNote = useCallback(async (title: string) => {
    try {
      // Create a new note
      const newNote = await createNote({
        title,
        content: '',
        tags: [],
      });
      
      if (newNote && newNote.id) {
        // Notify parent component that a new note was created
        if (onNoteCreated) {
          onNoteCreated(newNote.id);
        }
        
        return {
          id: newNote.id,
          title: newNote.title,
          type: 'note',
          index: 0 // Add index to match WikiLinkItem type
        };
      }
      
      throw new Error('Failed to create note');
    } catch (error) {
      console.error('Error creating note from wiki link:', error);
      throw error;
    }
  }, [createNote, onNoteCreated]);

  return { handleCreateNote };
};
