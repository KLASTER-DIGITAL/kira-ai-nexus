
import { useCallback } from "react";
import { useNotesMutations } from "@/hooks/notes/useNotesMutations";
import { useNoteLinks } from "../useNoteLinks";

/**
 * Hook for creating new wiki links and associated notes
 */
export const useWikiLinkCreation = (
  noteId?: string,
  onNoteCreated?: (noteId: string) => void
) => {
  const { createNote } = useNotesMutations();
  const { createLink } = useNoteLinks(noteId);

  /**
   * Create a new note with the given title and link it to the current note
   */
  const createNoteFromWikiLink = useCallback(
    async (title: string) => {
      try {
        // Create the new note
        const newNote = await createNote({
          title,
          content: "",
          tags: [],
          type: "note",
          user_id: "", // This will be filled by the backend
        });

        // Link the new note to the current note if we have a noteId
        if (noteId && newNote) {
          await createLink(noteId, newNote.id);
        }

        // Notify parent component that a note was created
        if (onNoteCreated && newNote) {
          onNoteCreated(newNote.id);
        }

        return newNote;
      } catch (error) {
        console.error("Error creating note from wiki link:", error);
        throw error;
      }
    },
    [noteId, createNote, createLink, onNoteCreated]
  );

  return {
    createNoteFromWikiLink
  };
};
