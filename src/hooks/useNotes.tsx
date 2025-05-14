
import { Note } from "@/types/notes";
import { 
  useNotes as useNotesHook, 
  useNotesQuery, 
  PaginatedNotesResult 
} from "./notes/useNotesQuery";
import { useNotesMutations } from "./notes/useNotesMutations";
import { NoteFilter } from "./notes/types";

export interface NotesQueryOptions {
  filter?: NoteFilter;
  page?: number;
  pageSize?: number;
}

// Re-export the notes hook functionality
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
