
import { useCallback } from 'react';
import { Note } from '@/types/notes';
import { NoteFilter, NoteInput } from './notes/types';
import { useNotesQuery } from './notes/useNotesQuery';
import { useNotesMutations } from './notes/useNotesMutations';

export const useNotes = (filter?: NoteFilter) => {
  const { data: notes, isLoading, error } = useNotesQuery(filter);
  const { createNote, updateNote, deleteNote } = useNotesMutations();

  return {
    notes,
    isLoading,
    error,
    createNote,
    updateNote,
    deleteNote
  };
};
