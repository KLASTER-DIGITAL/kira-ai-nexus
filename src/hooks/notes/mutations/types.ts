
import { Note } from "@/types/notes";

export interface CreateNoteInput {
  title: string;
  content: string;
  tags: string[];
  color?: string;
}

export interface UpdateNoteInput {
  id: string;
  title?: string;
  content?: string;
  tags?: string[];
  color?: string;
}

export interface NoteContent {
  text: string;
  tags: string[];
  color: string;
}

// Helper function to format notes from DB (shared across mutations)
export const formatNoteFromDb = (data: any): Note => {
  let content = '';
  let tags: string[] = [];
  let color: string | undefined = undefined;
  
  if (data.content) {
    // Handle content being potentially a string or object
    if (typeof data.content === 'object') {
      const contentObj = data.content as Record<string, any>;
      content = typeof contentObj.text === 'string' ? contentObj.text : '';
      
      // Ensure tags is always an array of strings
      if (Array.isArray(contentObj.tags)) {
        tags = contentObj.tags.map((tag: any) => String(tag));
      }
      
      color = typeof contentObj.color === 'string' ? contentObj.color : undefined;
    } else if (typeof data.content === 'string') {
      content = data.content;
    }
  }
  
  return {
    id: data.id,
    title: data.title,
    content,
    tags,
    color,
    type: data.type,
    user_id: data.user_id
  };
};
