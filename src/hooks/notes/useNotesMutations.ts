
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Note } from "@/types/notes";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { NoteInput } from "./types";

export const useNotesMutations = () => {
  const queryClient = useQueryClient();

  // Create a new note
  const createNoteMutation = useMutation({
    mutationFn: async (noteData: NoteInput): Promise<Note> => {
      const { data, error } = await supabase
        .from('nodes')
        .insert({
          title: noteData.title,
          content: noteData.content,
          tags: noteData.tags || [],
          color: noteData.color || null,
          type: 'note',
          user_id: (await supabase.auth.getUser()).data.user?.id
        })
        .select('*')
        .single();

      if (error) {
        console.error("Error creating note:", error);
        toast({
          title: "Ошибка создания заметки",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return data as Note;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['allNotes'] });
    }
  });

  // Update an existing note
  const updateNoteMutation = useMutation({
    mutationFn: async ({ id, ...noteData }: NoteInput & { id: string }): Promise<Note> => {
      const { data, error } = await supabase
        .from('nodes')
        .update({
          title: noteData.title,
          content: noteData.content,
          tags: noteData.tags,
          color: noteData.color,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        console.error("Error updating note:", error);
        toast({
          title: "Ошибка обновления заметки",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return data as Note;
    },
    onSuccess: (updatedNote) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['note', updatedNote.id] });
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
