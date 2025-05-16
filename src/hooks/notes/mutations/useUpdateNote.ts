
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Note, NoteContent } from "@/types/notes";
import { UpdateNoteInput, formatNoteFromDb } from "./types";

export const useUpdateNote = () => {
  const queryClient = useQueryClient();
  
  const updateNoteMutation = useMutation({
    mutationFn: async (noteData: UpdateNoteInput): Promise<Note> => {
      // Prepare update data
      const updateData: any = {};
      
      if (noteData.title !== undefined) {
        updateData.title = noteData.title;
      }
      
      // Handle content and metadata updates
      try {
        // First, get the current note to access current content
        const { data: currentNote, error: fetchError } = await supabase
          .from('nodes')
          .select('*')
          .eq('id', noteData.id)
          .single();
        
        if (fetchError) {
          throw fetchError;
        }
        
        // Safely handle the content field
        let currentContent: NoteContent = {
          text: '',
          tags: [],
          color: ''
        };
        
        if (currentNote.content && typeof currentNote.content === 'object') {
          // Safely extract values using typecasting when we know it's an object
          const contentObj = currentNote.content as Record<string, any>;
          currentContent = {
            text: typeof contentObj.text === 'string' ? contentObj.text : '',
            tags: Array.isArray(contentObj.tags) ? contentObj.tags : [],
            color: typeof contentObj.color === 'string' ? contentObj.color : ''
          };
        }
        
        // If we have new content, prepare it for update
        let newContent: string | null = null;
        if (typeof noteData.content === 'string') {
          // If content is a string, update text only
          updateData.content = {
            text: noteData.content,
            tags: noteData.tags !== undefined ? noteData.tags : currentContent.tags,
            color: noteData.color !== undefined ? noteData.color : currentContent.color
          };
        } else if (typeof noteData.content === 'object') {
          // If content is an object, use its properties
          updateData.content = {
            text: noteData.content.text || currentContent.text,
            tags: noteData.content.tags || currentContent.tags,
            color: noteData.content.color || currentContent.color
          };
        } else {
          // If no content update, use any tags or color updates
          updateData.content = {
            text: currentContent.text,
            tags: noteData.tags !== undefined ? noteData.tags : currentContent.tags,
            color: noteData.color !== undefined ? noteData.color : currentContent.color
          };
        }
        
        // Perform the update
        const { data, error } = await supabase
          .from('nodes')
          .update(updateData)
          .eq('id', noteData.id)
          .select()
          .single();
        
        if (error) {
          throw error;
        }

        // Format note before returning
        return formatNoteFromDb(data);
      } catch (error) {
        console.error("Error updating note:", error);
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['note', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['allNotes'] });
    }
  });

  return {
    updateNote: updateNoteMutation.mutateAsync,
    isUpdating: updateNoteMutation.isPending
  };
};
