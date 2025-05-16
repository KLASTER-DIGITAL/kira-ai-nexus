
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Note, NoteContent } from '@/types/notes';
import { useToast } from '@/hooks/use-toast';
import { useNoteLinks } from '@/hooks/notes/useNoteLinks';

export interface CreateNoteParams {
  title: string;
  content: NoteContent | string;
  tags: string[];
  user_id?: string;
  type?: string;
}

export interface UpdateNoteParams {
  id: string;
  title?: string;
  content?: NoteContent | string;
  tags?: string[];
  user_id?: string;
  type?: string;
}

export const useNotesMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Create note mutation
  const createNoteMutation = useMutation({
    mutationFn: async (data: CreateNoteParams) => {
      const { data: userResponse } = await supabase.auth.getUser();
      const userId = userResponse.user?.id;
      
      if (!userId) {
        throw new Error("User not authenticated");
      }
      
      // Prepare content object for database
      let dbContent: Record<string, any>;
      
      if (typeof data.content === 'object') {
        // If it's already an object, use it directly
        dbContent = {
          text: data.content.text || '',
          tags: data.content.tags || data.tags || [],
          color: data.content.color || ''
        };
      } else {
        // If it's a string, create an object
        dbContent = {
          text: data.content,
          tags: data.tags || [],
          color: ''
        };
      }
      
      const { data: result, error } = await supabase
        .from('nodes')
        .insert([{
          title: data.title,
          content: dbContent, // This is now a properly formatted JSON object
          type: data.type || 'note',
          user_id: userId
        }])
        .select();

      if (error) {
        throw error;
      }

      return result[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast({
        title: "Заметка создана",
        description: "Новая заметка успешно создана",
      });
    },
    onError: (error) => {
      console.error("Failed to create note:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось создать заметку",
        variant: "destructive",
      });
    },
  });

  // Update note mutation
  const updateNoteMutation = useMutation({
    mutationFn: async (data: UpdateNoteParams) => {
      // Prepare update data
      const updateData: Record<string, any> = {};
      
      if (data.title !== undefined) {
        updateData.title = data.title;
      }
      
      // Fetch current note to get existing content
      const { data: currentNote, error: fetchError } = await supabase
        .from('nodes')
        .select('*')
        .eq('id', data.id)
        .single();
        
      if (fetchError) {
        throw fetchError;
      }
      
      // Prepare content update
      let currentContentObj: Record<string, any> = {
        text: '',
        tags: [],
        color: ''
      };
      
      // Extract current content
      if (currentNote.content && typeof currentNote.content === 'object') {
        currentContentObj = {
          text: currentNote.content.text || '',
          tags: Array.isArray(currentNote.content.tags) ? currentNote.content.tags : [],
          color: currentNote.content.color || ''
        };
      }
      
      // Create new content object with updates
      const newContentObj: Record<string, any> = { ...currentContentObj };
      
      if (typeof data.content === 'string') {
        newContentObj.text = data.content;
      } else if (data.content && typeof data.content === 'object') {
        if (data.content.text !== undefined) {
          newContentObj.text = data.content.text;
        }
        if (data.content.tags !== undefined) {
          newContentObj.tags = data.content.tags;
        }
        if (data.content.color !== undefined) {
          newContentObj.color = data.content.color;
        }
      }
      
      // If tags provided separately, use them
      if (data.tags !== undefined) {
        newContentObj.tags = data.tags;
      }
      
      updateData.content = newContentObj;
      updateData.updated_at = new Date().toISOString();
      
      // Perform update
      const { data: result, error } = await supabase
        .from('nodes')
        .update(updateData)
        .eq('id', data.id)
        .select();

      if (error) {
        throw error;
      }

      return result[0];
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['note', variables.id] });
      toast({
        title: "Заметка обновлена",
        description: "Изменения сохранены",
      });
    },
    onError: (error) => {
      console.error("Failed to update note:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить заметку",
        variant: "destructive",
      });
    },
  });

  // Delete note mutation
  const deleteNoteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('nodes')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['note', id] });
      toast({
        title: "Заметка удалена",
        description: "Заметка была успешно удалена",
      });
    },
    onError: (error) => {
      console.error("Failed to delete note:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить заметку",
        variant: "destructive",
      });
    },
  });

  return {
    createNote: (data: CreateNoteParams) => createNoteMutation.mutate(data),
    updateNote: (data: UpdateNoteParams) => updateNoteMutation.mutate(data),
    deleteNote: (id: string) => deleteNoteMutation.mutate(id),
    isCreating: createNoteMutation.isPending,
    isUpdating: updateNoteMutation.isPending,
    isDeleting: deleteNoteMutation.isPending,
  };
};
