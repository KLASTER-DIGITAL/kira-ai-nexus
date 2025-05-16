
import { Note } from "@/types/notes";

/**
 * Преобразует сырые данные заметки из БД в тип Note
 */
export const transformNoteData = (data: any): Note => {
  // Обрабатываем content в зависимости от его типа
  const content = data.content && typeof data.content === 'object' 
    ? data.content.text || ""
    : data.content || "";
  
  // Извлекаем теги из объекта content, если они там есть
  const tags = data.content && typeof data.content === 'object' && data.content.tags
    ? data.content.tags
    : data.tags || [];
    
  // Извлекаем цвет из объекта content, если он там есть
  const color = data.content && typeof data.content === 'object' && data.content.color
    ? data.content.color
    : data.color || "";
  
  return {
    id: data.id,
    title: data.title,
    content,
    tags,
    color,
    user_id: data.user_id,
    type: data.type,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
};

/**
 * Extract all unique tags from notes
 */
export const extractUniqueTags = (notes: Note[]): string[] => {
  const tagsSet = new Set<string>();
  
  notes.forEach(note => {
    if (note.tags && Array.isArray(note.tags)) {
      note.tags.forEach(tag => tagsSet.add(tag));
    }
  });
  
  return [...tagsSet];
};
