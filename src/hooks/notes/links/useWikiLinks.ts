
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
        // Just await the operation without checking the result
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
        const createdNoteResult = await createNote(newNoteData as any);
        
        // Check that we have a valid note with an ID before proceeding
        if (createdNoteResult && typeof createdNoteResult === 'object' && 'id' in createdNoteResult) {
          const createdNote = createdNoteResult as Note;
          
          // Create a link if we have a current note
          if (noteId) {
            // Simply await the void function without treating its return value
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
        return null;
      } catch (error) {
        console.error("Error creating note:", error);
        return null;
      }
    }
  }, [notes, noteId, createWikiLink, createNote, onNoteCreated]);
  
  return { handleWikiLinkClick, isCreatingLink };
};
