
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Note } from "@/types/notes";
import { transformNoteData } from "./utils";

const createNote = async (noteData: { title: string; content: string; tags: string[]; color?: string }) => {
  try {
    const { data, error } = await supabase
      .from('nodes')  // Use 'nodes' table instead of 'notes'
      .insert({
        title: noteData.title,
        content: {
          text: noteData.content,
          tags: noteData.tags,
          color: noteData.color || ''
        },
        tags: noteData.tags,
        user_id: (await supabase.auth.getUser()).data.user?.id,
        type: 'note'
      })
      .select();

    if (error) {
      console.error('Error creating note:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error('No data returned from createNote');
    }

    // Transform the returned data to ensure it has the correct shape
    return transformNoteData(data[0]);
  } catch (error) {
    console.error('Error in createNote:', error);
    throw error;
  }
};

const updateNote = async (noteData: { noteId: string; noteData: { title: string; content: string; tags: string[]; color?: string } }) => {
  try {
    const { data, error } = await supabase
      .from('nodes')  // Use 'nodes' table instead of 'notes'
      .update({
        title: noteData.noteData.title,
        content: {
          text: noteData.noteData.content,
          tags: noteData.noteData.tags,
          color: noteData.noteData.color || ''
        },
        tags: noteData.noteData.tags,
        updated_at: new Date().toISOString()
      })
      .eq('id', noteData.noteId)
      .select();

    if (error) {
      console.error('Error updating note:', error);
      throw error;
    }

    // Process the returned data to ensure it matches our Note type
    if (data && data.length > 0) {
      // Transform the returned data to ensure it has the correct shape
      return transformNoteData(data[0]);
    }
    
    return null;
  } catch (error) {
    console.error('Error in updateNote:', error);
    throw error;
  }
};

const deleteNote = async (noteId: string) => {
  try {
    const { error } = await supabase
      .from('nodes')  // Use 'nodes' table instead of 'notes'
      .delete()
      .eq('id', noteId);

    if (error) {
      console.error('Error deleting note:', error);
      throw error;
    }

    return noteId;
  } catch (error) {
    console.error('Error in deleteNote:', error);
    throw error;
  }
};

export const useNotesMutations = () => {
  const queryClient = useQueryClient();

  // Update to use the object-style mutation configuration
  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    }
  });

  const updateNoteMutation = useMutation({
    mutationFn: (variables: { noteId: string; noteData: { title: string; content: string; tags: string[]; color?: string } }) => 
      updateNote(variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    }
  });

  const deleteNoteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    }
  });

  return {
    createNote: createNoteMutation.mutateAsync,
    updateNote: updateNoteMutation.mutateAsync,
    deleteNote: deleteNoteMutation.mutateAsync,
    isCreating: createNoteMutation.isPending,
    isUpdating: updateNoteMutation.isPending,
    isDeleting: deleteNoteMutation.isPending,
  };
};
