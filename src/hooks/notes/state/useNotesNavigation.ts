
import { useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Note } from "@/types/notes";
import { supabase } from "@/integrations/supabase/client";
import { transformNoteData } from "../utils";

/**
 * Hook for handling navigation related to notes
 */
export const useNotesNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Handle creating a new note and navigate to it
  const handleCreateNote = useCallback(
    async (data: { title: string; content?: string; tags?: string[]; color?: string }) => {
      try {
        console.log("Creating new note with data:", data);
        
        // Get current user from supabase session
        const { data: sessionData } = await supabase.auth.getSession();
        const userId = sessionData.session?.user?.id;
        
        if (!userId) {
          throw new Error("User is not authenticated");
        }
        
        // Prepare note content as JSON to store tags properly
        const noteContent = {
          text: data.content || "",
          tags: data.tags || [],
          color: data.color || ""
        };
        
        // Insert the new note into the database with user_id
        const { data: newNote, error } = await supabase
          .from("nodes")
          .insert({
            title: data.title,
            content: noteContent,
            type: "note",
            user_id: userId // Fix: Add the required user_id field
          })
          .select()
          .single();

        if (error) {
          console.error("Error creating note:", error);
          throw error;
        }

        console.log("New note created:", newNote);
        
        // Navigate to the newly created note
        if (newNote && newNote.id) {
          navigate(`/notes/${newNote.id}`);
          // Fix: Transform the data to match Note type before returning
          return transformNoteData(newNote) as Note;
        }
        
        return null;
      } catch (error) {
        console.error("Failed to create note:", error);
        throw error;
      }
    },
    [navigate]
  );

  // Navigate to a specific note
  const navigateToNote = useCallback(
    (noteId: string) => {
      navigate(`/notes/${noteId}`);
    },
    [navigate]
  );

  // Navigate to notes list
  const navigateToNotesList = useCallback(() => {
    navigate("/notes");
  }, [navigate]);

  return {
    handleCreateNote,
    navigateToNote,
    navigateToNotesList,
    currentPath: location.pathname
  };
};
