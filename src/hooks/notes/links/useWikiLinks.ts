
import { useCallback } from "react";
import { useNotes } from "@/hooks/useNotes";
import { useWikiLinkCreation } from "./useWikiLinkCreation";
import { Note } from "@/types/notes";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useWikiLinks = (noteId?: string, onNoteCreated?: (noteId: string) => void) => {
  const { notes, createNote } = useNotes({ pageSize: 100 });
  const { createWikiLink, isCreatingLink } = useWikiLinkCreation(noteId);
  const queryClient = useQueryClient();

  // Handle clicking on a wiki link
  const handleWikiLinkClick = useCallback(async (
    title: string, 
    onLinkClick?: (noteId: string) => void
  ) => {
    if (!title || !notes) return null;
    
    // Clean the title (remove brackets if present)
    const cleanTitle = title.replace(/^\[\[|\]\]$/g, "");
    
    // Find the note by title
    const targetNote = notes.find(note => 
      note.title.toLowerCase() === cleanTitle.toLowerCase()
    );
    
    if (targetNote) {
      // If note exists, navigate to it
      console.log("Found existing note:", targetNote.title);
      
      // If we have a current note ID, create a link between the notes
      if (noteId) {
        await createWikiLink(targetNote.title);
      }
      
      // Navigate to the existing note
      if (onLinkClick) {
        onLinkClick(targetNote.id);
      }
      
      return targetNote.id;
    } else {
      // If note doesn't exist, create a new one
      console.log("Creating new note:", cleanTitle);
      
      try {
        // Step 1: Create the note without relying on its return value
        await createNote({
          title: cleanTitle,
          content: "",
          tags: [],
          type: "note",
          user_id: "" // Will be filled by the backend
        } as any);
        
        // Step 2: Invalidate notes query to ensure we have latest data
        await queryClient.invalidateQueries({ queryKey: ['notes'] });
        
        // Step 3: Query the database directly to get the newly created note by title
        const { data: newNoteData, error } = await supabase
          .from('nodes')
          .select('id, title')
          .eq('title', cleanTitle)
          .eq('type', 'note')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        if (error || !newNoteData) {
          console.error("Error finding newly created note:", error);
          return null;
        }
        
        const createdNoteId = newNoteData.id;
        console.log("Created note with ID:", createdNoteId);
        
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
      } catch (error) {
        console.error("Error in wiki link creation flow:", error);
        return null;
      }
    }
  }, [notes, noteId, createWikiLink, createNote, onNoteCreated, queryClient]);
  
  return { handleWikiLinkClick, isCreatingLink };
};
