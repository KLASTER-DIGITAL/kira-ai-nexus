
import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth';

export interface Note {
  id: string;
  title: string;
  content: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
  type: string;
  tags?: string[];
}

interface NoteInput {
  title: string;
  content: string;
  tags?: string[];
}

interface NoteFilter {
  searchText?: string;
}

export const useNotes = (filter?: NoteFilter) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  // Fetch notes from Supabase
  const {
    data: notes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['notes', filter],
    queryFn: async () => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      let query = supabase
        .from('nodes')
        .select('*')
        .eq('type', 'note')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
        
      if (filter?.searchText) {
        const searchTerm = filter.searchText.toLowerCase();
        query = query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`);
      }
      
      const { data, error } = await query;
      
      if (error) {
        toast({
          title: "Ошибка загрузки заметок",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }
      
      return data as Note[];
    },
    enabled: !!user,
  });

  // Create a new note
  const createNoteMutation = useMutation({
    mutationFn: async (newNote: NoteInput): Promise<Note> => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      const noteToInsert = {
        user_id: user.id,
        type: 'note',
        title: newNote.title,
        content: newNote.content,
        // If you have a tags column, uncomment this:
        // tags: newNote.tags || []
      };

      const { data, error } = await supabase
        .from('nodes')
        .insert(noteToInsert)
        .select()
        .single();

      if (error) {
        toast({
          title: "Ошибка при создании заметки",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }

      toast({
        title: "Заметка создана",
        description: `"${newNote.title}" успешно сохранена`
      });

      return data as Note;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    }
  });

  // Update an existing note
  const updateNoteMutation = useMutation({
    mutationFn: async (updatedNote: Partial<Note> & { id: string }): Promise<Note> => {
      const { data, error } = await supabase
        .from('nodes')
        .update({
          title: updatedNote.title,
          content: updatedNote.content,
          updated_at: new Date().toISOString()
        })
        .eq('id', updatedNote.id)
        .select()
        .single();

      if (error) {
        toast({
          title: "Ошибка при обновлении заметки",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }

      toast({
        title: "Заметка обновлена",
        description: `"${updatedNote.title}" успешно сохранена`
      });

      return data as Note;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
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
        toast({
          title: "Ошибка при удалении заметки",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }

      toast({
        title: "Заметка удалена",
        description: "Заметка успешно удалена"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    }
  });

  return {
    notes,
    isLoading,
    error,
    createNote: createNoteMutation.mutate,
    updateNote: updateNoteMutation.mutate,
    deleteNote: deleteNoteMutation.mutate
  };
};
