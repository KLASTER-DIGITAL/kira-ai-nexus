import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Note } from "@/types/notes";

const createNote = async (noteData: { title: string; content: string; tags: string[] }) => {
  try {
    const { data, error } = await supabase
      .from('notes')
      .insert({
        title: noteData.title,
        content: {
          text: noteData.content,
          tags: noteData.tags,
          color: ''
        },
        tags: noteData.tags,
        user_id: supabase.auth.getUser().then((response) => response.data?.user?.id),
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

const updateNote = async (noteId: string, noteData: { title: string; content: string; tags: string[] }) => {
  try {
    const { data, error } = await supabase
      .from('notes')
      .update({
        title: noteData.title,
        content: {
          // Ensure we're creating a proper object with the required properties
          text: noteData.content,
          tags: noteData.tags,
          color: ''  // Default empty color
        },
        tags: noteData.tags,
        updated_at: new Date().toISOString()
      })
      .eq('id', noteId)
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
      let noteTags = noteData.tags;
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
      .from('notes')
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

  const createNoteMutation = useMutation(createNote, {
    onSuccess: () => {
      queryClient.invalidateQueries(['notes']);
    },
  });

  const updateNoteMutation = useMutation(
    (variables: { noteId: string; noteData: { title: string; content: string; tags: string[] } }) =>
      updateNote(variables.noteId, variables.noteData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['notes']);
      },
    }
  );

  const deleteNoteMutation = useMutation(deleteNote, {
    onSuccess: () => {
      queryClient.invalidateQueries(['notes']);
    },
  });

  return {
    createNote: createNoteMutation.mutateAsync,
    updateNote: updateNoteMutation.mutateAsync,
    deleteNote: deleteNoteMutation.mutateAsync,
    isCreating: createNoteMutation.isLoading,
    isUpdating: updateNoteMutation.isLoading,
    isDeleting: deleteNoteMutation.isLoading,
  };
};
