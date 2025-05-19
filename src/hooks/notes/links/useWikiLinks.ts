
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNotesMutations } from "../useNotesMutations";
import { toast } from "sonner";

/**
 * Hook для обработки вики-ссылок
 */
export const useWikiLinks = (noteId?: string, onNoteCreated?: (noteId: string) => void) => {
  const { createNote } = useNotesMutations();
  
  /**
   * Извлекает заголовок заметки из вики-ссылки
   */
  const extractTitleFromLink = useCallback((href: string): string => {
    if (!href) return '';
    // Извлекаем текст между [[ и ]]
    const match = href.match(/\[\[(.*?)\]\]/);
    return match ? match[1] : href;
  }, []);

  /**
   * Обработка клика по вики-ссылке
   */
  const handleWikiLinkClick = useCallback(
    async (href: string, onLinkClick?: (noteId: string) => void) => {
      const title = extractTitleFromLink(href);
      
      try {
        // Проверяем существует ли заметка с таким заголовком
        const { data: existingNotes, error } = await supabase
          .from('nodes')
          .select('id, title')
          .eq('title', title)
          .eq('type', 'note')
          .limit(1);
        
        if (error) {
          console.error("Ошибка при проверке существования заметки:", error);
          return;
        }
        
        if (existingNotes && existingNotes.length > 0) {
          // Если заметка существует, перенаправляем на нее
          if (onLinkClick) {
            onLinkClick(existingNotes[0].id);
          }
        } else {
          // Если заметки не существует, создаем новую
          const result = await createNote({
            title,
            content: '',
            tags: []
          });
          
          console.log("Создана новая заметка:", result);
          toast.success(`Создана заметка "${title}"`, {
            description: "Заметка успешно создана",
          });
          
          if (onNoteCreated && result) {
            onNoteCreated(result.id);
          }
          
          if (onLinkClick && result) {
            onLinkClick(result.id);
          }
        }
      } catch (error) {
        console.error("Ошибка при обработке вики-ссылки:", error);
        toast.error("Ошибка при переходе по ссылке");
      }
    },
    [extractTitleFromLink, createNote, onNoteCreated]
  );

  return {
    handleWikiLinkClick,
    isCreatingLink: false // Можно расширить для отображения состояния загрузки
  };
};
