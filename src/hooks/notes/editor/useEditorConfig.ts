
import { useMemo, useCallback } from "react";
import { useEditorExtensions } from "./useEditorExtensions";
import { Editor } from '@tiptap/react';

interface EditorConfigProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  editable?: boolean;
  autoFocus?: boolean;
  noteId?: string;
  onNoteCreated?: (noteId: string) => void;
}

export const useEditorConfig = ({ 
  content, 
  onChange, 
  placeholder = "Начните писать...", 
  editable = true, 
  autoFocus = false, 
  noteId, 
  onNoteCreated 
}: EditorConfigProps) => {
  
  // Простая проверка вики-ссылок
  const validateWikiLink = useCallback((href: string) => {
    return href && href.startsWith('[[') && href.endsWith(']]');
  }, []);

  // Получаем конфигурацию расширений
  const { getExtensions } = useEditorExtensions(placeholder, validateWikiLink);
  
  // Получаем полную конфигурацию редактора
  const getEditorConfig = useCallback(() => {
    return {
      editable,
      content,
      onUpdate: ({ editor }: { editor: Editor }) => {
        onChange(editor.getHTML());
      },
      // Fix: Convert string 'end' to proper focus position or use boolean
      autofocus: autoFocus ? 'end' as const : false,
      extensions: getExtensions(),
      editorProps: {
        attributes: {
          class: 'focus:outline-none',
        }
      }
    };
  }, [content, onChange, editable, autoFocus, getExtensions]);

  // Функция для проверки и обновления вики-ссылок
  const validateLinks = useCallback((editor: Editor) => {
    // Здесь можно реализовать логику проверки и обновления ссылок
    // Например, проверить существование заметок, на которые есть ссылки
    console.log("Validating links in the editor");
  }, []);

  return {
    getEditorConfig,
    validateLinks
  };
};
