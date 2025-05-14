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
      const { data, error } = await supabase
        .from('nodes')
        .insert({
          title: noteData.title,
          content: noteData.content || '',
          type: 'note',
          // Convert array to JSON compatible format
          meta: {
            tags: noteData.tags || [],
            color: noteData.color || ''
          }
        })
        .select()
        .single();
      
      if (error) {
        console.error("Error creating note:", error);
        throw error;
      }
      
      // Format the note with proper types before returning
      return {
        ...data,
        id: data.id,
        title: data.title,
        content: data.content,
        tags: data.meta?.tags as string[] || [],
        color: data.meta?.color as string || undefined,
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
      
      // Handle metadata updates with proper typing
      const { data: currentNote } = await supabase
        .from('nodes')
        .select('meta')
        .eq('id', noteData.id)
        .single();
      
      const currentMeta = currentNote?.meta || { tags: [], color: '' };
      
      // Update metadata preserving existing fields
      updateData.meta = {
        ...currentMeta,
        tags: noteData.tags !== undefined ? noteData.tags : currentMeta.tags,
        color: noteData.color !== undefined ? noteData.color : currentMeta.color
      };
      
      // Perform the update
      const { data, error } = await supabase
        .from('nodes')
        .update(updateData)
        .eq('id', noteData.id)
        .select()
        .single();
      
      if (error) {
        console.error("Error updating note:", error);
        throw error;
      }
      
      // Format the note with proper types before returning
      return {
        ...data,
        id: data.id,
        title: data.title,
        content: data.content,
        tags: data.meta?.tags as string[] || [],
        color: data.meta?.color as string || undefined,
        type: data.type,
        user_id: data.user_id
      };
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
    createNote: (noteData: CreateNoteInput) => createNoteMutation.mutate(noteData),
    updateNote: (noteData: UpdateNoteInput) => updateNoteMutation.mutate(noteData),
    deleteNote: deleteNoteMutation.mutateAsync,
    isCreating: createNoteMutation.isPending,
    isUpdating: updateNoteMutation.isPending,
    isDeleting: deleteNoteMutation.isPending
  };
};
