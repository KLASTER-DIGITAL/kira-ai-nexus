
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
      // Убедимся, что цвет сохраняется правильно
      const colorToSave = noteData.color || '';
      
      if (activeNote) {
        // Update existing note - правильно формируем формат контента
        await updateNote({
          noteId: activeNote.id,
          noteData: {
            title: noteData.title,
            content: noteData.content,
            tags: noteData.tags,
            color: colorToSave
          }
        });
        
        console.log("Заметка обновлена");
        toast.success("Заметка обновлена");
        return true;
      } else {
        // Create new note
        const result = await createNote({
          title: noteData.title,
          content: noteData.content,
          tags: noteData.tags,
          color: colorToSave
        });
        
        console.log("Заметка создана:", result);
        toast.success("Заметка создана");
        return true;
      }
    } catch (error) {
      console.error("Ошибка при сохранении заметки:", error);
      let errorMessage = "Не удалось сохранить заметку. Попробуйте еще раз.";
      
      if (error instanceof Error) {
        console.error(`Детали ошибки: ${error.message}`);
        // Если у нас есть более конкретное сообщение, покажем его
        if (error.message.includes("User not authenticated")) {
          errorMessage = "Требуется авторизация для сохранения заметки";
        }
      }
      
      toast.error(errorMessage);
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
