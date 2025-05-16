
import { Note } from "@/types/notes";

/**
 * Transforms raw database note data into a structured Note object
 * @param rawData Raw data from the database
 * @returns Formatted Note object
 */
export const transformNoteData = (rawData: any): Note => {
  try {
    // Extract content
    let content: any;
    let tags: string[] = [];
    let color: string = '';

    // Handle content based on its structure
    if (typeof rawData.content === 'object' && rawData.content !== null) {
      const contentObj = rawData.content;
      // Extract the text from the content object
      const text = contentObj.text || '';
      // Use tags from the content object or fall back to the ones at the root level
      tags = Array.isArray(contentObj.tags) ? contentObj.tags : (rawData.tags || []);
      // Extract color if available
      color = contentObj.color || '';
      
      // We'll store the actual content text in the note.content property
      content = text;
    } else if (typeof rawData.content === 'string') {
      // If content is somehow a string, use it directly
      content = rawData.content;
      tags = rawData.tags || [];
    } else {
      // Default fallback
      content = '';
      tags = rawData.tags || [];
    }

    // Create a properly structured Note object
    const note: Note = {
      id: rawData.id,
      title: rawData.title || '',
      content: content,  // This is now the text content
      tags: tags,
      color: color,
      user_id: rawData.user_id,
      created_at: rawData.created_at,
      updated_at: rawData.updated_at,
      type: rawData.type || 'note',
    };

    return note;
  } catch (error) {
    console.error("Error transforming note data:", error, rawData);
    
    // Return a minimal valid note object to prevent crashes
    return {
      id: rawData.id || 'unknown',
      title: rawData.title || 'Error loading note',
      content: '',
      tags: [],
      user_id: rawData.user_id || '',
      type: 'note',
    };
  }
};
