
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Note } from "@/types/notes";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

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

interface NoteContent {
  text: string;
  tags: string[];
  color: string;
}

export const useNotesMutations = () => {
  const queryClient = useQueryClient();
  
  // Create a new note
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
        
        // If we have content, tags or color updates, update the content field
        updateData.content = {
          text: noteData.content !== undefined ? noteData.content : currentContent.text,
          tags: noteData.tags !== undefined ? noteData.tags : currentContent.tags,
          color: noteData.color !== undefined ? noteData.color : currentContent.color
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

  // Helper function to format notes from DB
  const formatNoteFromDb = (data: any): Note => {
    let content = '';
    let tags: string[] = [];
    let color: string | undefined = undefined;
    
    if (data.content) {
      // Handle content being potentially a string or object
      if (typeof data.content === 'object') {
        const contentObj = data.content as Record<string, any>;
        content = typeof contentObj.text === 'string' ? contentObj.text : '';
        
        // Ensure tags is always an array of strings
        if (Array.isArray(contentObj.tags)) {
          tags = contentObj.tags.map((tag: any) => String(tag));
        }
        
        color = typeof contentObj.color === 'string' ? contentObj.color : undefined;
      } else if (typeof data.content === 'string') {
        content = data.content;
      }
    }
    
    return {
      id: data.id,
      title: data.title,
      content,
      tags,
      color,
      type: data.type,
      user_id: data.user_id
    };
  };

  return {
    createNote: createNoteMutation.mutateAsync,
    updateNote: updateNoteMutation.mutateAsync,
    deleteNote: deleteNoteMutation.mutateAsync,
    isCreating: createNoteMutation.isPending,
    isUpdating: updateNoteMutation.isPending,
    isDeleting: deleteNoteMutation.isPending
  };
};
