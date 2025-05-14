
import { useCallback } from 'react';
import { Note } from '@/types/notes';
import { NoteFilter, NoteInput } from './notes/types';
import { useNotesQuery, NotesQueryOptions } from './notes/useNotesQuery';
import { useNotesMutations } from './notes/useNotesMutations';

export const useNotes = (options?: NotesQueryOptions) => {
  const { data, isLoading, error } = useNotesQuery(options);
  const { createNote, updateNote, deleteNote } = useNotesMutations();

  return {
    notes: data?.notes || [],
    isLoading,
    error,
    totalCount: data?.totalCount || 0,
    totalPages: data?.totalPages || 0,
    currentPage: data?.currentPage || 1,
    createNote,
    updateNote,
    deleteNote
  };
};
