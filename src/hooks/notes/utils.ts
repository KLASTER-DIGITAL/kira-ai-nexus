
import { Note } from "@/types/notes";

/**
 * Преобразует сырые данные заметки из базы данных в структурированный объект Note
 * @param rawData Сырые данные из базы данных
 * @returns Отформатированный объект Note
 */
export const transformNoteData = (rawData: any): Note => {
  try {
    console.log("Трансформация данных заметки:", rawData);

    if (!rawData) {
      console.error("Получены пустые данные заметки");
      throw new Error("Пустые данные заметки");
    }

    // Извлекаем содержимое
    let content: any = '';
    let tags: string[] = [];
    let color: string = '';

    // Обрабатываем содержимое в зависимости от его структуры
    if (typeof rawData.content === 'object' && rawData.content !== null) {
      const contentObj = rawData.content;
      
      // Извлекаем текст из объекта содержимого
      const text = contentObj.text || contentObj.content || '';
      
      // Извлекаем теги из объекта содержимого или из корневого уровня
      tags = Array.isArray(contentObj.tags) 
        ? contentObj.tags 
        : (Array.isArray(rawData.tags) ? rawData.tags : []);
      
      // Извлекаем цвет, если доступен
      color = contentObj.color || contentObj.backgroundColor || '';
      
      // Сохраняем текстовое содержимое в свойство note.content
      content = text;
    } else if (typeof rawData.content === 'string') {
      // Если содержимое является строкой, используем его напрямую
      content = rawData.content;
      tags = Array.isArray(rawData.tags) ? rawData.tags : [];
    } else {
      // Запасной вариант по умолчанию
      content = '';
      tags = Array.isArray(rawData.tags) ? rawData.tags : [];
    }

    // Создаем правильно структурированный объект Note
    const note: Note = {
      id: rawData.id,
      title: rawData.title || '',
      content: content,
      tags: tags,
      color: color,
      user_id: rawData.user_id,
      created_at: rawData.created_at,
      updated_at: rawData.updated_at,
      type: rawData.type || 'note',
    };

    console.log("Преобразованная заметка:", note);
    return note;
  } catch (error) {
    console.error("Ошибка преобразования данных заметки:", error, rawData);
    
    // Возвращаем минимальный действительный объект заметки для предотвращения сбоев
    return {
      id: rawData?.id || 'unknown',
      title: rawData?.title || 'Ошибка загрузки заметки',
      content: '',
      tags: [],
      user_id: rawData?.user_id || '',
      type: 'note',
    };
  }
};
