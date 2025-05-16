
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
    if (!notes) return null;
    
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
      const newNoteData = {
        title: cleanTitle,
        content: "",
        tags: [],
        type: "note" as const,
        user_id: "" // Will be filled by the backend
      };
      
      try {
        // Create the note and capture the result
        // Use createNote as a Promise that returns Note or null
        const createdNote = await createNote(newNoteData as any) as Note | null;
        
        // Check if we have a valid note with an ID
        if (createdNote && 'id' in createdNote) {
          const createdNoteId = createdNote.id;
          
          // Create a link if we have a current note ID
          if (noteId) {
            await createWikiLink(cleanTitle);
          }
          
          // Notify parent component
          if (onNoteCreated) {
            onNoteCreated(createdNoteId);
          }
          
          // Navigate to the new note
          if (onLinkClick) {
            onLinkClick(createdNoteId);
          }
          
          return createdNoteId;
        }
        
        return null;
      } catch (error) {
        console.error("Error creating note:", error);
        return null;
      }
    }
  }, [notes, noteId, createWikiLink, createNote, onNoteCreated]);
  
  return { handleWikiLinkClick, isCreatingLink };
};
