
import { useState } from "react";
import { Note } from "@/types/notes";
import { useNotesMutations } from "@/hooks/notes/useNotesMutations";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook для управления мутациями заметок (создание, обновление, удаление)
 */
export const useNotesMutation = () => {
  const { createNote, updateNote, deleteNote } = useNotesMutations();

  // Обработка сохранения заметки (как новой, так и редактируемой)
  const handleSaveNote = async (
    noteData: { title: string; content: string; tags: string[]; color?: string }, 
    activeNote?: Note
  ) => {
    console.log("Сохраняем заметку:", noteData);
    try {
      // Проверяем авторизацию пользователя перед сохранением
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData.user) {
        console.error("Ошибка авторизации:", authError || "Пользователь не авторизован");
        toast.error("Требуется авторизация для сохранения заметки");
        return false;
      }
      
      // Убедимся, что цвет сохраняется правильно
      const colorToSave = noteData.color || '';
      
      if (activeNote) {
        // Обновляем существующую заметку
        const result = await updateNote({
          noteId: activeNote.id,
          noteData: {
            title: noteData.title,
            content: noteData.content,
            tags: noteData.tags,
            color: colorToSave
          }
        });
        
        console.log("Заметка обновлена:", result);
        toast.success("Заметка обновлена");
        return true;
      } else {
        // Создаем новую заметку
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
        } else if (error.message.includes("JWT")) {
          errorMessage = "Ошибка аутентификации. Пожалуйста, войдите снова";
        } else if (error.message.includes("violates row-level security")) {
          errorMessage = "Нет прав для выполнения этого действия";
        }
      }
      
      toast.error(errorMessage);
      return false;
    }
  };

  // Обработка подтверждения удаления заметки
  const handleConfirmDelete = async (activeNote?: Note) => {
    if (activeNote) {
      try {
        // Проверяем авторизацию пользователя перед удалением
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError || !authData.user) {
          console.error("Ошибка авторизации:", authError || "Пользователь не авторизован");
          toast.error("Требуется авторизация для удаления заметки");
          return false;
        }
        
        await deleteNote(activeNote.id);
        toast.success("Заметка удалена");
        return true;
      } catch (error) {
        console.error("Ошибка при удалении заметки:", error);
        let errorMessage = "Не удалось удалить заметку";
        
        if (error instanceof Error) {
          if (error.message.includes("User not authenticated")) {
            errorMessage = "Требуется авторизация для удаления заметки";
          }
        }
        
        toast.error(errorMessage);
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
