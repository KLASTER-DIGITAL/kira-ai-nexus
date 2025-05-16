
import { Note, NoteContent } from "@/types/notes";

/**
 * Преобразует сырые данные заметки из БД в тип Note
 */
export const transformNoteData = (data: any): Note => {
  let content: string | NoteContent = "";
  let tags: string[] = [];
  let color = "";
  
  // Handle content based on its type
  if (data.content) {
    if (typeof data.content === 'object') {
      // Если у нас есть структурированный контент
      if (data.content.text !== undefined) {
        // У нас уже есть структурированный объект NoteContent
        content = {
          text: data.content.text || "",
          tags: Array.isArray(data.content.tags) ? data.content.tags : [],
          color: data.content.color || ""
        };
        tags = content.tags;
        color = content.color;
      } else {
        // У нас какой-то другой объект
        content = JSON.stringify(data.content);
        // Try to extract tags if present
        if (Array.isArray(data.content.tags)) {
          tags = data.content.tags;
        }
        if (data.content.color) {
          color = data.content.color;
        }
      }
    } else if (typeof data.content === 'string') {
      content = data.content;
    }
  }
  
  // If tags not found in content object, use the root tags (if available)
  if (tags.length === 0 && Array.isArray(data.tags)) {
    tags = data.tags;
  }
  
  // If color not found in content object, use the root color (if available)
  if (!color && data.color) {
    color = data.color;
  }
  
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
