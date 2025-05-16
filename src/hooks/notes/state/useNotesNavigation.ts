
import { useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Note } from "@/types/notes";
import { supabase } from "@/integrations/supabase/client";

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
        
        // Insert the new note into the database
        const { data: newNote, error } = await supabase
          .from("nodes")
          .insert({
            title: data.title,
            content: data.content || "",
            type: "note",
            // Safely handle tags and color by checking if they exist
            ...(data.tags ? { tags: data.tags } : {}),
            ...(data.color ? { color: data.color } : {})
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
          return newNote as Note;
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
