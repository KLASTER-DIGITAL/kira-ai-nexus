
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Note } from "@/types/notes";
import { transformNoteData } from "./utils";

const createNote = async (noteData: { title: string; content: string; tags: string[]; color?: string }) => {
  try {
    console.log("Creating note with data:", noteData);
    
    // Проверяем авторизацию пользователя
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not authenticated");
      throw new Error("User not authenticated");
    }
    
    // Подготовка данных для сохранения в БД
    // В таблице nodes контент хранится как JSON-объект
    const noteContent = {
      text: noteData.content || '',
      tags: noteData.tags || [],
      color: noteData.color || ''
    };
    
    const { data, error } = await supabase
      .from('nodes')
      .insert({
        title: noteData.title,
        content: noteContent,
        user_id: user.id,
        type: 'note',
        tags: noteData.tags || [] // Duplicating tags at the root level for easier querying
      })
      .select();

    if (error) {
      console.error('Error creating note:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error('No data returned from createNote');
    }

    console.log("Created note successfully:", data[0]);
    return transformNoteData(data[0]);
  } catch (error) {
    console.error('Error in createNote:', error);
    throw error;
  }
};

const updateNote = async (noteData: { noteId: string; noteData: { title: string; content: string; tags: string[]; color?: string } }) => {
  try {
    console.log("Updating note with data:", noteData);
    
    // Проверяем авторизацию пользователя
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not authenticated");
      throw new Error("User not authenticated");
    }
    
    // Подготовка данных для обновления
    const noteContent = {
      text: noteData.noteData.content || '',
      tags: noteData.noteData.tags || [],
      color: noteData.noteData.color || ''
    };
    
    const { data, error } = await supabase
      .from('nodes')
      .update({
        title: noteData.noteData.title,
        content: noteContent,
        tags: noteData.noteData.tags || [], // Обновляем теги в корне для удобства запросов
        updated_at: new Date().toISOString()
      })
      .eq('id', noteData.noteId)
      .eq('user_id', user.id)  // Добавлена проверка user_id для усиления безопасности
      .select();

    if (error) {
      console.error('Error updating note:', error);
      throw error;
    }

    // Process the returned data to ensure it matches our Note type
    if (data && data.length > 0) {
      console.log("Updated note successfully:", data[0]);
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
    console.log("Deleting note:", noteId);
    
    // Проверяем авторизацию пользователя
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not authenticated");
      throw new Error("User not authenticated");
    }
    
    const { error } = await supabase
      .from('nodes')
      .delete()
      .eq('id', noteId)
      .eq('user_id', user.id);  // Добавлена проверка user_id для усиления безопасности

    if (error) {
      console.error('Error deleting note:', error);
      throw error;
    }

    console.log("Deleted note successfully:", noteId);
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
