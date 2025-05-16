
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Note } from "@/types/notes";
import { transformNoteData } from "./utils";

const createNote = async (noteData: { title: string; content: string; tags: string[]; color?: string }) => {
  try {
    console.log("Создание заметки с данными:", noteData);
    
    // Проверяем авторизацию пользователя
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("Пользователь не авторизован");
      throw new Error("Пользователь не авторизован");
    }
    
    // Подготовка данных для сохранения в БД
    // В таблице nodes контент хранится как JSON-объект
    const noteContent = {
      text: noteData.content || '',
      tags: noteData.tags || [],
      color: noteData.color || ''
    };
    
    console.log("Подготовленные данные заметки:", {
      title: noteData.title,
      content: noteContent,
      user_id: user.id,
      type: 'note',
      tags: noteData.tags || []
    });
    
    const { data, error } = await supabase
      .from('nodes')
      .insert({
        title: noteData.title,
        content: noteContent,
        user_id: user.id,
        type: 'note',
        tags: noteData.tags || [] // Дублирование тегов на корневом уровне для удобства запросов
      })
      .select();

    if (error) {
      console.error('Ошибка при создании заметки:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error('Не получены данные после создания заметки');
    }

    console.log("Заметка успешно создана:", data[0]);
    return transformNoteData(data[0]);
  } catch (error) {
    console.error('Ошибка в createNote:', error);
    throw error;
  }
};

const updateNote = async (noteData: { noteId: string; noteData: { title: string; content: string; tags: string[]; color?: string } }) => {
  try {
    console.log("Обновление заметки с данными:", noteData);
    
    // Проверяем авторизацию пользователя
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("Пользователь не авторизован");
      throw new Error("Пользователь не авторизован");
    }
    
    // Подготовка данных для обновления
    const noteContent = {
      text: noteData.noteData.content || '',
      tags: noteData.noteData.tags || [],
      color: noteData.noteData.color || ''
    };
    
    console.log("Подготовленные данные для обновления заметки:", {
      id: noteData.noteId,
      title: noteData.noteData.title,
      content: noteContent,
      tags: noteData.noteData.tags
    });
    
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
      console.error('Ошибка при обновлении заметки:', error);
      throw error;
    }

    // Process the returned data to ensure it matches our Note type
    if (data && data.length > 0) {
      console.log("Заметка успешно обновлена:", data[0]);
      return transformNoteData(data[0]);
    }
    
    return null;
  } catch (error) {
    console.error('Ошибка в updateNote:', error);
    throw error;
  }
};

const deleteNote = async (noteId: string) => {
  try {
    console.log("Удаление заметки:", noteId);
    
    // Проверяем авторизацию пользователя
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("Пользователь не авторизован");
      throw new Error("Пользователь не авторизован");
    }
    
    const { error } = await supabase
      .from('nodes')
      .delete()
      .eq('id', noteId)
      .eq('user_id', user.id);  // Добавлена проверка user_id для усиления безопасности

    if (error) {
      console.error('Ошибка при удалении заметки:', error);
      throw error;
    }

    console.log("Заметка успешно удалена:", noteId);
    return noteId;
  } catch (error) {
    console.error('Ошибка в deleteNote:', error);
    throw error;
  }
};

export const useNotesMutations = () => {
  const queryClient = useQueryClient();

  // Используем конфигурацию в формате объекта для мутаций
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
