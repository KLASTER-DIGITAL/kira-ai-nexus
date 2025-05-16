
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Note } from "@/types/notes";

const createNote = async (noteData: { title: string; content: string; tags: string[] }) => {
  try {
    const { data, error } = await supabase
      .from('nodes')  // Use 'nodes' table instead of 'notes'
      .insert({
        title: noteData.title,
        content: {
          text: noteData.content,
          tags: noteData.tags,
          color: ''
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

    return data ? data[0] as Note : null;
  } catch (error) {
    console.error('Error in createNote:', error);
    throw error;
  }
};

const updateNote = async (noteData: { noteId: string; noteData: { title: string; content: string; tags: string[] } }) => {
  try {
    const { data, error } = await supabase
      .from('nodes')  // Use 'nodes' table instead of 'notes'
      .update({
        title: noteData.noteData.title,
        content: {
          text: noteData.noteData.content,
          tags: noteData.noteData.tags,
          color: ''
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
    if (data && data[0]) {
      const updatedNote = data[0];
      const content = updatedNote.content;
      
      // Handle different content structures safely
      let noteContent = '';
      let noteTags = noteData.noteData.tags;
      let noteColor = '';
      
      if (typeof content === 'object' && content !== null) {
        // Cast to any to avoid TypeScript errors
        const contentObj = content as any;
        noteContent = contentObj.text || '';
        noteTags = Array.isArray(contentObj.tags) ? contentObj.tags : (updatedNote.tags || []);
        noteColor = contentObj.color || '';
      } else if (typeof content === 'string') {
        noteContent = content;
      }

      return {
        ...updatedNote,
        content: noteContent,
        tags: noteTags,
        color: noteColor
      };
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
    mutationFn: (variables: { noteId: string; noteData: { title: string; content: string; tags: string[] } }) => 
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
