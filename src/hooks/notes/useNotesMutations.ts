
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth";
import { Note } from "@/types/notes";
import { NoteInput } from "./types";
import { transformNoteData } from "./utils";

export const useNotesMutations = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

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
        content: {
          text: newNote.content,
          tags: newNote.tags || []
        }
      };

      // Optimistically add the note to the query cache
      const optimisticNote: Note = {
        id: `temp-${Date.now()}`,
        user_id: user.id,
        title: newNote.title,
        content: newNote.content,
        tags: newNote.tags || [],
        type: 'note',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Add optimistic update
      queryClient.setQueryData(['notes'], (oldData: any) => {
        if (!oldData) return { notes: [optimisticNote], totalCount: 1, totalPages: 1, currentPage: 1 };
        
        const updatedNotes = [optimisticNote, ...oldData.notes];
        return {
          ...oldData,
          notes: updatedNotes,
          totalCount: oldData.totalCount + 1
        };
      });

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

      // Transform the returned data to match Note type
      return transformNoteData(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
    onError: () => {
      // Revert optimistic update on error
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    }
  });

  // Update an existing note
  const updateNoteMutation = useMutation({
    mutationFn: async (updatedNote: Partial<Note> & { id: string }): Promise<Note> => {
      // Prepare the content object
      const contentUpdate = {
        text: updatedNote.content,
        tags: updatedNote.tags || []
      };
      
      const updateData: any = {
        updated_at: new Date().toISOString(),
        content: contentUpdate
      };
      
      if (updatedNote.title !== undefined) updateData.title = updatedNote.title;
      
      // Optimistic update in cache
      queryClient.setQueryData(['notes'], (oldData: any) => {
        if (!oldData) return oldData;
        
        const updatedNotes = oldData.notes.map((note: Note) => 
          note.id === updatedNote.id 
            ? { 
                ...note, 
                title: updatedNote.title ?? note.title,
                content: updatedNote.content ?? note.content,
                tags: updatedNote.tags ?? note.tags,
                updated_at: new Date().toISOString()
              }
            : note
        );
        
        return {
          ...oldData,
          notes: updatedNotes
        };
      });
      
      const { data, error } = await supabase
        .from('nodes')
        .update(updateData)
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
        description: `"${updatedNote.title || 'Заметка'}" успешно сохранена`
      });

      // Transform the returned data to match Note type
      return transformNoteData(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
    onError: () => {
      // Revert optimistic update on error
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    }
  });

  // Delete a note
  const deleteNoteMutation = useMutation({
    mutationFn: async (noteId: string): Promise<void> => {
      // Optimistically remove from cache
      queryClient.setQueryData(['notes'], (oldData: any) => {
        if (!oldData) return oldData;
        
        const filteredNotes = oldData.notes.filter((note: Note) => note.id !== noteId);
        
        return {
          ...oldData,
          notes: filteredNotes,
          totalCount: Math.max(0, oldData.totalCount - 1)
        };
      });
      
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
    },
    onError: () => {
      // Revert optimistic update on error
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    }
  });

  return {
    createNote: createNoteMutation.mutate,
    updateNote: updateNoteMutation.mutate,
    deleteNote: deleteNoteMutation.mutate
  };
};
