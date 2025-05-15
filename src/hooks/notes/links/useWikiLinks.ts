
import { useCallback } from "react";
import { useNotes } from "@/hooks/useNotes";
import { useNotesMutations } from "@/hooks/notes/useNotesMutations";
import { useNoteLinks } from "../useNoteLinks";
import { Note } from "@/types/notes";

/**
 * Hook that provides wiki link functionality for the TipTap editor
 */
export const useWikiLinks = (noteId?: string, onNoteCreated?: (noteId: string) => void) => {
  const { notes } = useNotes({ pageSize: 100 });
  const { createNote } = useNotesMutations();
  const { createLink } = useNoteLinks(noteId);

  // Validate if a wiki link points to an existing note
  const validateWikiLink = useCallback(
    (href: string): boolean => {
      if (!notes) return false;
      
      // Check if there's a note with the given title
      return notes.some(note => note.title.toLowerCase() === href.toLowerCase());
    },
    [notes]
  );

  // Fetch notes for suggestion based on query
  const fetchNotesForSuggestion = useCallback(
    async (query: string): Promise<Note[]> => {
      if (!notes) return [];
      
      // Filter notes by title
      return notes.filter(note => 
        note.title.toLowerCase().includes(query.toLowerCase())
      );
    },
    [notes]
  );

  // Handle creating a new note
  const handleCreateNote = useCallback(
    async (title: string) => {
      if (!title.trim()) return;
      
      // Create a new note
      const newNote = await createNote({
        title,
        content: "",
        tags: [],
        type: "note",
        user_id: "", // This will be filled by the service
      });

      // Create link between current note and new note if in editing context
      if (noteId && newNote) {
        await createLink(noteId, newNote.id, "note");
      }
      
      // Notify parent component of created note
      if (onNoteCreated && newNote) {
        onNoteCreated(newNote.id);
      }
      
      return newNote;
    },
    [noteId, createNote, createLink, onNoteCreated]
  );

  // Handle clicking on a wiki link
  const handleWikiLinkClick = useCallback(
    (href: string, onClick: (noteId: string) => void) => {
      if (!notes) return;
      
      // Find the note that corresponds to the wiki link
      const note = notes.find(
        note => note.title.toLowerCase() === href.toLowerCase()
      );
      
      // If note exists, pass its ID to the click handler
      if (note) {
        onClick(note.id);
      }
    },
    [notes]
  );

  return {
    validateWikiLink,
    fetchNotesForSuggestion,
    handleCreateNote,
    handleWikiLinkClick,
    allNotes: notes
  };
};
