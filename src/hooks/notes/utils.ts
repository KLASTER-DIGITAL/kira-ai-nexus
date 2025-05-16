
import { Note, NoteContent } from "@/types/notes";

// Преобразование данных из БД в формат заметки для фронтенда
export const transformNoteData = (data: any): Note => {
  if (!data) {
    throw new Error("Cannot transform null or undefined data to Note");
  }

  let noteContent: string | NoteContent = '';
  let noteTags: string[] = [];
  let noteColor: string = '';

  // Обрабатываем content в зависимости от его формата
  if (data.content) {
    if (typeof data.content === 'object') {
      // Если content - объект, проверяем его структуру
      if (data.content.text !== undefined) {
        // Если в объекте есть поле text, это структурированный контент
        noteContent = {
          text: data.content.text || '',
          tags: Array.isArray(data.content.tags) ? data.content.tags : [],
          color: data.content.color || ''
        };
        noteTags = noteContent.tags;
        noteColor = noteContent.color;
      } else {
        // Если структура объекта не соответствует ожидаемой, преобразуем в строку
        noteContent = JSON.stringify(data.content);
      }
    } else if (typeof data.content === 'string') {
      // Если content - строка, используем как есть
      noteContent = data.content;
    }
  }

  return {
    id: data.id,
    title: data.title || '',
    content: noteContent,
    tags: noteTags,
    color: noteColor,
    user_id: data.user_id,
    type: data.type || 'note',
    created_at: data.created_at,
    updated_at: data.updated_at
  };
};

// Вспомогательная функция для extract текста из контента (если он в формате объекта)
export const getNoteContentText = (content: string | NoteContent): string => {
  if (typeof content === 'string') {
    return content;
  }
  return content.text || '';
};
