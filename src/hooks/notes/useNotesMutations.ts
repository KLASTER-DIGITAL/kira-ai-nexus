
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Note } from "@/types/notes";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { NoteInput } from "./types";

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

export const useNotesMutations = () => {
  const queryClient = useQueryClient();
  
  // Create a new note
  const createNoteMutation = useMutation({
    mutationFn: async (noteData: CreateNoteInput): Promise<Note> => {
      // Create the basic note data without meta field
      const noteInsert = {
        title: noteData.title,
        content: noteData.content || '',
        type: 'note',
      };
      
      // Add metadata as a separate field (assuming Supabase has a meta JSONB column)
      const metaData = {
        tags: noteData.tags || [],
        color: noteData.color || ''
      };
      
      // Insert the note with separate metadata
      const { data, error } = await supabase
        .from('nodes')
        .insert({
          ...noteInsert,
          meta: metaData
        })
        .select()
        .single();
      
      if (error) {
        console.error("Error creating note:", error);
        throw error;
      }
      
      // Format the note with proper types before returning
      return {
        id: data.id,
        title: data.title,
        content: data.content,
        tags: data.meta?.tags || [],
        color: data.meta?.color,
        type: data.type,
        user_id: data.user_id
      };
    },
    onSuccess: () => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['allNotes'] });
    }
  });
  
  // Update an existing note
  const updateNoteMutation = useMutation({
    mutationFn: async (noteData: UpdateNoteInput): Promise<Note> => {
      // Prepare update data
      const updateData: any = {};
      
      if (noteData.title !== undefined) {
        updateData.title = noteData.title;
      }
      
      if (noteData.content !== undefined) {
        updateData.content = noteData.content;
      }
      
      // Handle metadata updates
      try {
        // First, get the current note to access current metadata
        const { data: currentNote, error: fetchError } = await supabase
          .from('nodes')
          .select('*')
          .eq('id', noteData.id)
          .single();
        
        if (fetchError) {
          throw fetchError;
        }
        
        // If we have tags or color updates, update the metadata
        if (noteData.tags !== undefined || noteData.color !== undefined) {
          const currentMeta = currentNote.meta || { tags: [], color: '' };
          
          updateData.meta = {
            ...currentMeta,
            tags: noteData.tags !== undefined ? noteData.tags : currentMeta.tags,
            color: noteData.color !== undefined ? noteData.color : currentMeta.color
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
        
        // Format the note with proper types before returning
        return {
          id: data.id,
          title: data.title,
          content: data.content,
          tags: data.meta?.tags || [],
          color: data.meta?.color,
          type: data.type,
          user_id: data.user_id
        };
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

  // Delete a note
  const deleteNoteMutation = useMutation({
    mutationFn: async (noteId: string): Promise<void> => {
      const { error } = await supabase
        .from('nodes')
        .delete()
        .eq('id', noteId);

      if (error) {
        console.error("Error deleting note:", error);
        toast({
          title: "Ошибка удаления заметки",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['allNotes'] });
    }
  });

  return {
    createNote: createNoteMutation.mutateAsync,
    updateNote: updateNoteMutation.mutateAsync,
    deleteNote: deleteNoteMutation.mutateAsync,
    isCreating: createNoteMutation.isPending,
    isUpdating: updateNoteMutation.isPending,
    isDeleting: deleteNoteMutation.isPending
  };
};
