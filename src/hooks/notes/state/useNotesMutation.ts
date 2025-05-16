
import { useState } from "react";
import { Note, NoteContent } from "@/types/notes";
import { useNotesMutations } from "@/hooks/notes/useNotesMutations";
import { toast } from "sonner";

/**
 * Hook for managing note mutations (create, update, delete)
 */
export const useNotesMutation = () => {
  const { createNote, updateNote, deleteNote } = useNotesMutations();

  // Handle saving a note (both new and edit)
  const handleSaveNote = async (
    noteData: { title: string; content: string; tags: string[]; color?: string }, 
    activeNote?: Note
  ) => {
    console.log("Сохраняем заметку:", noteData);
    try {
      if (activeNote) {
        // Update existing note - правильно формируем формат контента
        await updateNote({
          noteId: activeNote.id,
          noteData: {
            title: noteData.title,
            content: noteData.content,
            tags: noteData.tags,
            color: noteData.color
          }
        });
        
        console.log("Заметка обновлена");
        return true;
      } else {
        // Create new note
        const result = await createNote({
          title: noteData.title,
          content: noteData.content,
          tags: noteData.tags,
          color: noteData.color
        });
        
        console.log("Заметка создана:", result);
        return true;
      }
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
    handleConfirmDelete,
    updateNote,
    deleteNote
  };
};
