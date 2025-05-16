
import { Note } from "@/types/notes";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Hook for managing notes navigation and selection
 */
export const useNotesNavigation = (
  handleEditNote: (note: Note) => void, 
  notes?: Note[]
) => {
  // Handle note selection via wiki links
  const handleNoteSelect = (noteId: string) => {
    console.log("Выбрана заметка по ID:", noteId);
    const selectedNote = notes?.find((note) => note.id === noteId);
    
    if (selectedNote) {
      handleEditNote(selectedNote);
    } else {
      console.log("Заметка не найдена среди загруженных, загружаем из базы...");
      // Если не найдена в текущем списке, получить заметку напрямую из базы
      supabase
        .from('nodes')
        .select('*')
        .eq('id', noteId)
        .single()
        .then(({ data, error }) => {
          if (error) {
            console.error("Ошибка загрузки заметки:", error);
            toast.error("Не удалось загрузить заметку");
          } else if (data) {
            // Преобразовать данные в формат Note
            const content = typeof data.content === 'object' ? data.content : { text: data.content };
            
            const note: Note = {
              id: data.id,
              title: data.title,
              content: content?.text || "",
              tags: content?.tags || [],
              color: content?.color,
              type: data.type,
              user_id: data.user_id,
              created_at: data.created_at,
              updated_at: data.updated_at
            };
            handleEditNote(note);
          }
        });
    }
  };

  return {
    handleNoteSelect
  };
};
