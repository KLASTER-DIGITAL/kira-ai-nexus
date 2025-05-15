
import { useCreateNote } from "./mutations/useCreateNote";
import { useUpdateNote } from "./mutations/useUpdateNote";
import { useDeleteNote } from "./mutations/useDeleteNote";
import { CreateNoteInput, UpdateNoteInput } from "./mutations/types";

export type { CreateNoteInput, UpdateNoteInput } from "./mutations/types";

export const useNotesMutations = () => {
  const { createNote, isCreating } = useCreateNote();
  const { updateNote, isUpdating } = useUpdateNote();
  const { deleteNote, isDeleting } = useDeleteNote();

  return {
    createNote,
    updateNote,
    deleteNote,
    isCreating,
    isUpdating,
    isDeleting
  };
};
