
import { useState, useEffect } from "react";
import { Note } from "@/types/notes";
import { useNotesMutations } from "./useNotesMutations";
import { toast } from "sonner";

/**
 * Хук для работы с редактором заметок
 * Объединяет функциональность создания и редактирования заметок
 */
export const useNoteEditor = (note?: Note, onSuccess?: () => void) => {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [tags, setTags] = useState(note?.tags || []);
  const [color, setColor] = useState(note?.color || "");
  const { createNote, updateNote, isCreating, isUpdating } = useNotesMutations();
  
  // Обновление состояния при изменении note
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content || "");
      setTags(note.tags || []);
      setColor(note.color || "");
    } else {
      setTitle("");
      setContent("");
      setTags([]);
      setColor("");
    }
  }, [note]);

  // Обработчик сохранения заметки
  const handleSave = async () => {
    console.log("Сохраняем заметку", { title, content, tags, isNew: !note });
    
    try {
      if (note) {
        // Обновление существующей заметки
        await updateNote({
          id: note.id,
          title,
          content,
          tags,
          color
        });
        toast.success("Заметка обновлена");
      } else {
        // Создание новой заметки
        const result = await createNote({
          title,
          content,
          tags,
          color,
          user_id: "", // Will be filled by backend
          type: "note"
        });
        console.log("Заметка создана:", result);
        toast.success("Заметка создана");
      }
      
      if (onSuccess) {
        onSuccess();
      }
      
      return true;
    } catch (error) {
      console.error("Ошибка при сохранении заметки:", error);
      toast.error(note ? "Ошибка при обновлении заметки" : "Ошибка при создании заметки");
      return false;
    }
  };

  return {
    title,
    setTitle,
    content,
    setContent,
    tags,
    setTags,
    color,
    setColor,
    handleSave,
    isLoading: isCreating || isUpdating
  };
};
