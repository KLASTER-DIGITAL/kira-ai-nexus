
import { useState, useEffect } from "react";
import { Note, NoteContent } from "@/types/notes";
import { useNotesMutations } from "./useNotesMutations";
import { toast } from "sonner";

/**
 * Хук для работы с редактором заметок
 * Объединяет функциональность создания и редактирования заметок
 */
export const useNoteEditor = (note?: Note, onSuccess?: () => void) => {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content && typeof note.content === 'object' ? note.content.text : (note?.content || ""));
  const [tags, setTags] = useState(note?.tags || []);
  const [color, setColor] = useState(note?.color || "");
  const { createNote, updateNote, isCreating, isUpdating } = useNotesMutations();
  
  // Обновление состояния при изменении note
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      
      if (typeof note.content === 'object') {
        setContent(note.content.text || "");
        setTags(note.content.tags || note.tags || []);
        setColor(note.content.color || note.color || "");
      } else {
        setContent(note.content || "");
        setTags(note.tags || []);
        setColor(note.color || "");
      }
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
        // Обновление существующей заметки - формируем данные в правильном формате для БД
        const contentObject: NoteContent = {
          text: content,
          tags,
          color
        };
        
        await updateNote({
          id: note.id,
          title,
          content: contentObject,
          user_id: note.user_id,
          type: "note"
        });
        toast.success("Заметка обновлена");
      } else {
        // Создание новой заметки - передаем данные в правильном формате
        const contentObject: NoteContent = {
          text: content,
          tags,
          color
        };
        
        const result = await createNote({
          title,
          content: contentObject,
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
