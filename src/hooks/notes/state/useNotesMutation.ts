
import { useState } from "react";
import { Note } from "@/types/notes";
import { useNotesMutations } from "@/hooks/notes/useNotesMutations";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook for managing note mutations (create, update, delete)
 */
export const useNotesMutation = () => {
  const { createNote, updateNote, deleteNote } = useNotesMutations();

  // Handle saving a note (both new and edit)
  const handleSaveNote = async (
    noteData: { title: string; content: string; tags: string[] }, 
    activeNote?: Note
  ) => {
    console.log("Сохраняем заметку:", noteData);
    try {
      if (activeNote) {
        // Update existing note - правильно формируем формат контента
        await updateNote({
          id: activeNote.id,
          title: noteData.title,
          content: {
            text: noteData.content,
            tags: noteData.tags,
            color: activeNote.color || ""
          },
          user_id: activeNote.user_id,
          type: activeNote.type
        });
        toast.success("Заметка обновлена");
      } else {
        // Create new note - правильно формируем формат контента
        const result = await createNote({
          title: noteData.title,
          content: {
            text: noteData.content,
            tags: noteData.tags,
            color: ""
          },
          user_id: "", // Will be filled by backend
          type: "note"
        });
        
        console.log("Заметка создана:", result);
        toast.success("Заметка создана");
      }
      return true;
    } catch (error) {
      console.error("Ошибка при сохранении заметки:", error);
      toast.error("Не удалось сохранить заметку. Попробуйте еще раз.");
      return false;
    }
  };

  // Handle confirming note deletion
  const handleConfirmDelete = async (activeNote?: Note) => {
    if (activeNote) {
      try {
        await deleteNote(activeNote.id);
        toast.success("Заметка удалена");
        return true;
      } catch (error) {
        console.error("Ошибка при удалении заметки:", error);
        toast.error("Не удалось удалить заметку");
        return false;
      }
    }
    return false;
  };

  return {
    handleSaveNote,
    handleConfirmDelete
  };
};
