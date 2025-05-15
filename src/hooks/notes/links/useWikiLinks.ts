
import { useCallback } from "react";
import { useNotes } from "@/hooks/useNotes";
import { useWikiLinkCreation } from "./useWikiLinkCreation";
import { Note } from "@/types/notes";

export const useWikiLinks = (noteId?: string, onNoteCreated?: (noteId: string) => void) => {
  const { notes, createNote } = useNotes({ pageSize: 100 });
  const { createWikiLink, isCreatingLink } = useWikiLinkCreation(noteId);

  // Handle clicking on a wiki link
  const handleWikiLinkClick = useCallback(async (
    title: string, 
    onLinkClick?: (noteId: string) => void
  ) => {
    if (!notes) return;
    
    // Clean the title (remove brackets if present)
    const cleanTitle = title.replace(/^\[\[|\]\]$/g, "");
    
    // Find the note by title
    const targetNote = notes.find(note => 
      note.title.toLowerCase() === cleanTitle.toLowerCase()
    );
    
    if (targetNote) {
      // If note exists, navigate to it
      if (onLinkClick) {
        onLinkClick(targetNote.id);
      }
      
      // If we have a current note ID, create a link between the notes
      if (noteId) {
        await createWikiLink(targetNote.title);
      }
      
      return targetNote.id;
    } else {
      // If note doesn't exist, create a new one
      const newNote: Partial<Note> = {
        title: cleanTitle,
        content: "",
        tags: [],
        type: "note"
      };
      
      const createdNote = await createNote(newNote);
      
      // If the note was created successfully
      if (createdNote) {
        // Create a link if we have a current note
        if (noteId) {
          await createWikiLink(cleanTitle);
        }
        
        // Notify parent component
        if (onNoteCreated) {
          onNoteCreated(createdNote.id);
        }
        
        // Navigate to the new note
        if (onLinkClick) {
          onLinkClick(createdNote.id);
        }
        
        return createdNote.id;
      }
    }
    
    return null;
  }, [notes, noteId, createWikiLink, createNote, onNoteCreated]);
  
  return { handleWikiLinkClick, isCreatingLink };
};
