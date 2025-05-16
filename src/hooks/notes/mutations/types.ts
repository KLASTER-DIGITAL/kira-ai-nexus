
import { Note, NoteContent } from "@/types/notes";

export interface CreateNoteInput {
  title: string;
  content: string | NoteContent;
  tags?: string[];
  color?: string;
}

export interface UpdateNoteInput {
  id: string;
  title?: string;
  content?: string | NoteContent;
  tags?: string[];
  color?: string;
}

// Helper function to format notes from DB (shared across mutations)
export const formatNoteFromDb = (data: any): Note => {
  let content: string | NoteContent = '';
  let tags: string[] = [];
  let color: string | undefined = undefined;
  
  if (data.content) {
    // Handle content being potentially a string or object
    if (typeof data.content === 'object') {
      // Если у нас есть объект контента с полями
      if (data.content.text !== undefined) {
        content = {
          text: data.content.text || '',
          tags: Array.isArray(data.content.tags) ? data.content.tags : [],
          color: data.content.color || ''
        };
        tags = content.tags;
        color = content.color;
      } else {
        // Если другой формат объекта
        content = JSON.stringify(data.content);
      }
    } else if (typeof data.content === 'string') {
      content = data.content;
    }
  }
  
  // If no tags in content, check root level tags
  if (tags.length === 0 && Array.isArray(data.tags)) {
    tags = data.tags;
  }
  
  // If no color in content, check root level color
  if (!color && data.color) {
    color = data.color;
  }
  
  return {
    id: data.id,
    title: data.title,
    content,
    tags,
    color,
    type: data.type || 'note',
    user_id: data.user_id,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
};
