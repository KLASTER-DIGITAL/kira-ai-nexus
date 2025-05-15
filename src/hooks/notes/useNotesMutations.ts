
import { useCreateNote } from "./mutations/useCreateNote";
import { useUpdateNote } from "./mutations/useUpdateNote";
import { useDeleteNote } from "./mutations/useDeleteNote";
import { CreateNoteInput, UpdateNoteInput } from "./mutations/types";
import { useCallback } from "react";
import { useWikiLinkCreation } from "./links/useWikiLinkCreation";

export type { CreateNoteInput, UpdateNoteInput } from "./mutations/types";

export const useNotesMutations = () => {
  const { createNote: createNoteBase, isCreating } = useCreateNote();
  const { updateNote: updateNoteBase, isUpdating } = useUpdateNote();
  const { deleteNote, isDeleting } = useDeleteNote();
  const { processContentLinks } = useWikiLinkCreation();
  
  // Extend createNote to process wiki links
  const createNote = useCallback(async (input: CreateNoteInput) => {
    const newNote = await createNoteBase(input);
    
    if (newNote && newNote.id && input.content) {
      // Process wiki links in the content and create connections
      await processContentLinks(newNote.id, input.content);
    }
    
    return newNote;
  }, [createNoteBase, processContentLinks]);
  
  // Extend updateNote to process wiki links
  const updateNote = useCallback(async (input: UpdateNoteInput) => {
    const updatedNote = await updateNoteBase(input);
    
    if (updatedNote && updatedNote.id && input.content) {
      // Process wiki links in the content and create connections
      await processContentLinks(updatedNote.id, input.content);
    }
    
    return updatedNote;
  }, [updateNoteBase, processContentLinks]);

  return {
    createNote,
    updateNote,
    deleteNote,
    isCreating,
    isUpdating,
    isDeleting
  };
};
