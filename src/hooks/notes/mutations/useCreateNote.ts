import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Note, NoteContent } from "@/types/notes";
import { CreateNoteInput, formatNoteFromDb } from "./types";

export const useCreateNote = () => {
  const queryClient = useQueryClient();
  
  const createNoteMutation = useMutation({
    mutationFn: async (noteData: CreateNoteInput): Promise<Note> => {
      // Fetch current user_id
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Prepare content data as object for DB storage
      let contentData: NoteContent;
      
      if (typeof noteData.content === 'object') {
        // If content is already an object with the right structure, use it
        contentData = {
          text: noteData.content.text || '',
          tags: noteData.content.tags || noteData.tags || [],
          color: noteData.content.color || noteData.color || ''
        };
      } else {
        // Otherwise construct the content object from separate fields
        contentData = {
          text: noteData.content || '',
          tags: noteData.tags || [],
          color: noteData.color || ''
        };
      }
      
      // Insert the note with proper content structure
      const { data, error } = await supabase
        .from('nodes')
        .insert({
          title: noteData.title,
          content: contentData,
          type: 'note',
          user_id: user.id
        })
        .select()
        .single();
      
      if (error) {
        console.error("Error creating note:", error);
        throw error;
      }

      // Format the note with proper types before returning
      return formatNoteFromDb(data);
    },
    onSuccess: () => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['allNotes'] });
    }
  });

  return {
    createNote: createNoteMutation.mutateAsync,
    isCreating: createNoteMutation.isPending
  };
};
