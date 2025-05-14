
import { Note } from "@/types/notes";

// Helper function to transform raw note data from Supabase into the Note type
export const transformNoteData = (rawNote: any): Note => {
  const content = rawNote.content as any;
  return {
    ...rawNote,
    tags: content?.tags || [],
    content: typeof content === 'object' ? content?.text || null : content
  };
};
