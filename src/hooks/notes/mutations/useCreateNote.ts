
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Note } from "@/types/notes";
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
      
      // For the nodes table, we need to store the metadata (tags, color) in the content field as JSON
      const contentData = {
        text: noteData.content || '',
        tags: noteData.tags || [],
        color: noteData.color || ''
      };
      
      // Insert the note with content as JSON
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
