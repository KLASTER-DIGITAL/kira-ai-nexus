
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
        let currentContent: Record<string, any> = {
          text: '',
          tags: [],
          color: ''
        };
        
        if (currentNote.content && typeof currentNote.content === 'object') {
          // Extract values from current content
          const contentObj = currentNote.content as Record<string, any>;
          currentContent = {
            text: typeof contentObj.text === 'string' ? contentObj.text : '',
            tags: Array.isArray(contentObj.tags) ? contentObj.tags : [],
            color: typeof contentObj.color === 'string' ? contentObj.color : ''
          };
        }
        
        // Prepare new content
        const newContent: Record<string, any> = {
          text: currentContent.text,
          tags: currentContent.tags,
          color: currentContent.color
        };
        
        // Update with new values if they exist
        if (typeof noteData.content === 'string') {
          // If content is a string, update text only
          newContent.text = noteData.content;
          
          // Если есть новые теги/цвет, обновляем их тоже
          if (noteData.tags !== undefined) {
            newContent.tags = noteData.tags;
            updateData.tags = noteData.tags; // Также обновляем массив тегов в корне
          }
          
          if (noteData.color !== undefined) {
            newContent.color = noteData.color;
          }
          
        } else if (typeof noteData.content === 'object') {
          // If content is an object, use its properties
          if (noteData.content.text !== undefined) {
            newContent.text = noteData.content.text;
          }
          
          if (Array.isArray(noteData.content.tags)) {
            newContent.tags = noteData.content.tags;
            updateData.tags = noteData.content.tags; // Также обновляем массив тегов в корне
          }
          
          if (noteData.content.color !== undefined) {
            newContent.color = noteData.content.color;
          }
        } else {
          // Если контент не передан, проверяем наличие тегов и цвета
          if (noteData.tags !== undefined) {
            newContent.tags = noteData.tags;
            updateData.tags = noteData.tags; // Также обновляем массив тегов в корне
          }
          
          if (noteData.color !== undefined) {
            newContent.color = noteData.color;
          }
        }
        
        // Установим обновленный контент
        updateData.content = newContent;
        
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
