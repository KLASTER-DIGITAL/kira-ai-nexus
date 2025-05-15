
/**
 * @deprecated This file is maintained for backward compatibility.
 * Please import directly from '@/hooks/notes' for future development.
 */

import { Note } from "@/types/notes";
import { 
  useNotes as useNotesHook, 
  useNotesQuery, 
  NotesQueryOptions,
  useNotesMutations
} from "./notes";

// Re-export the notes hook functionality with a simplified interface
export const useNotes = (options: NotesQueryOptions = {}) => {
  const result = useNotesHook(options);
  const { createNote, updateNote, deleteNote } = useNotesMutations();
  
  return {
    notes: result.notes,
    isLoading: result.isLoading,
    error: result.error,
    totalCount: result.totalCount,
    totalPages: result.totalPages,
    currentPage: result.currentPage,
    createNote,
    updateNote,
    deleteNote
  };
};

// Re-export needed types
export type { NotesQueryOptions } from "./notes";
