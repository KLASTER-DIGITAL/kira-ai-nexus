
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Note } from '@/types/notes';
import { useToast } from '@/hooks/use-toast';
import { useNoteLinks } from '@/hooks/notes/useNoteLinks';

export const useNotesMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Create note mutation
  const createNoteMutation = useMutation({
    mutationFn: async (data: Omit<Note, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: result, error } = await supabase
        .from('nodes')
        .insert([{
          ...data,
          type: 'note'
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
    mutationFn: async (data: Partial<Note> & { id: string }) => {
      const { data: result, error } = await supabase
        .from('nodes')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
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
    createNote: (data: Omit<Note, 'id' | 'created_at' | 'updated_at'>) => createNoteMutation.mutate(data),
    updateNote: (data: Partial<Note> & { id: string }) => updateNoteMutation.mutate(data),
    deleteNote: (id: string) => deleteNoteMutation.mutate(id),
    isCreating: createNoteMutation.isPending,
    isUpdating: updateNoteMutation.isPending,
    isDeleting: deleteNoteMutation.isPending,
  };
};
