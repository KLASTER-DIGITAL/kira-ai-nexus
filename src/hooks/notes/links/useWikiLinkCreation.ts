
import { useCallback } from 'react';
import { useNoteLinks } from '@/hooks/notes/useNoteLinks';
import { useNotesMutations } from '@/hooks/notes/useNotesMutations';
import { CreateLinkParams } from './types';

export const useWikiLinkCreation = (noteId?: string) => {
  const { createLink, allNotes } = useNoteLinks(noteId);
  const { createNote } = useNotesMutations();

  // Create a note from a wiki link
  const createNoteFromWikiLink = useCallback(
    async (title: string) => {
      if (!title) return null;

      try {
        // Create the new note
        const newNoteData = {
          title,
          content: '',
          tags: [],
          type: 'note' as const,
        };

        // Using the createNote function from useNotesMutations
        const newNote = await createNote(newNoteData);
        
        // If the current note exists, create a link between them
        if (noteId && newNote.id) {
          const linkData: CreateLinkParams = {
            source_id: noteId,
            target_id: newNote.id,
            type: 'wikilink',
          };
          createLink(linkData);
        }

        return newNote;
      } catch (error) {
        console.error('Failed to create note from wiki link:', error);
        return null;
      }
    },
    [noteId, createLink, createNote]
  );

  // Find note by title
  const findNoteByTitle = useCallback(
    (title: string) => {
      if (!allNotes) return null;
      return allNotes.find(
        (note) => note.title.toLowerCase() === title.toLowerCase()
      );
    },
    [allNotes]
  );

  return {
    createNoteFromWikiLink,
    findNoteByTitle,
    existingNotes: allNotes || [],
  };
};
