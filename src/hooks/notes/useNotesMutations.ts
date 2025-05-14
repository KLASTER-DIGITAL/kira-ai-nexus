
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
          user_id: supabase.auth.getUser().then(res => res.data.user?.id) // Add user_id field
        })
        .select()
        .single();
      
      if (error) {
        console.error("Error creating note:", error);
        throw error;
      }

      // Safely access potentially nested properties
      const contentObj = typeof data.content === 'object' ? data.content : {};
      
      // Format the note with proper types before returning
      return {
        id: data.id,
        title: data.title,
        content: contentObj && 'text' in contentObj ? String(contentObj.text || '') : '',
        tags: contentObj && 'tags' in contentObj ? (Array.isArray(contentObj.tags) ? contentObj.tags : []) : [],
        color: contentObj && 'color' in contentObj ? String(contentObj.color || '') : undefined,
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
        
        // Safely handle the content field which could be a string or object
        const currentContentObj = typeof currentNote.content === 'object' ? 
          currentNote.content : 
          { text: '', tags: [], color: '' };
        
        // If we have content, tags or color updates, update the content field
        updateData.content = {
          text: noteData.content !== undefined ? noteData.content : 
            (currentContentObj && 'text' in currentContentObj ? currentContentObj.text : ''),
          tags: noteData.tags !== undefined ? noteData.tags : 
            (currentContentObj && 'tags' in currentContentObj ? currentContentObj.tags : []),
          color: noteData.color !== undefined ? noteData.color : 
            (currentContentObj && 'color' in currentContentObj ? currentContentObj.color : '')
        };
        
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

        // Safely access potentially nested properties
        const contentObj = typeof data.content === 'object' ? data.content : {};
        
        // Format the note with proper types before returning
        return {
          id: data.id,
          title: data.title,
          content: contentObj && 'text' in contentObj ? String(contentObj.text || '') : '',
          tags: contentObj && 'tags' in contentObj ? (Array.isArray(contentObj.tags) ? contentObj.tags : []) : [],
          color: contentObj && 'color' in contentObj ? String(contentObj.color || '') : undefined,
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
