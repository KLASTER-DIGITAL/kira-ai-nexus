
import { Note, NoteContent } from "@/types/notes";

/**
 * Преобразует сырые данные заметки из БД в тип Note
 */
export const transformNoteData = (data: any): Note => {
  let content = "";
  let tags: string[] = [];
  let color = "";
  
  // Handle content based on its type
  if (data.content) {
    if (typeof data.content === 'object') {
      // Extract content from the content object
      content = data.content.text || "";
      tags = Array.isArray(data.content.tags) ? data.content.tags : [];
      color = data.content.color || "";
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
