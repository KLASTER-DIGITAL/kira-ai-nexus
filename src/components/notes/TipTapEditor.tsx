
import React, { useEffect, useRef } from "react";
import { useEditor, EditorContent, Editor, BubbleMenu, FloatingMenu } from "@tiptap/react";
import { useEditorConfig } from "@/hooks/notes/editor/useEditorConfig";
import { useWikiLinks } from "@/hooks/notes/links/useWikiLinks";
import { addWikiLinkClickHandlers } from "./extensions/wiki-link/WikiLinkClickHandler";
import EnhancedMenuBar from "./menubar/EnhancedMenuBar";
import BubbleMenuComponent from "./extensions/bubble-menu/BubbleMenuComponent";
import FloatingMenuComponent from "./extensions/floating-menu/FloatingMenuComponent";
import "@/styles/notes/tiptap.css";
import "@/styles/notes/task-list.css";

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  editable?: boolean;
  noteId?: string;
  onLinkClick?: (noteId: string) => void;
  onNoteCreated?: (noteId: string) => void;
  onColorChange?: (color: string) => void;
}

const TipTapEditor: React.FC<TipTapEditorProps> = ({
  content,
  onChange,
  placeholder = "Начните писать...",
  autoFocus = false,
  editable = true,
  noteId,
  onLinkClick,
  onNoteCreated,
  onColorChange
}) => {
  // Базовая конфигурация редактора
  const { getEditorConfig, validateLinks } = useEditorConfig({
    content,
    onChange,
    placeholder,
    editable,
    autoFocus,
    noteId,
    onNoteCreated
  });
  
  // Функциональность вики-ссылок 
  const { handleWikiLinkClick } = useWikiLinks(noteId, onNoteCreated);
  
  // Инициализируем редактор с конфигурацией
  const editor = useEditor(getEditorConfig());
  
  // Сохраняем ссылку на редактор для очистки
  const editorRef = useRef<Editor | null>(null);

  // Настраиваем ссылку на редактор и обработчики кликов для read-only режима
  useEffect(() => {
    editorRef.current = editor;
    
    // Добавляем обработчик кликов по вики-ссылкам в режиме чтения
    if (editor && !editable && onLinkClick) {
      const cleanup = addWikiLinkClickHandlers(
        editor,
        (href) => handleWikiLinkClick(href, onLinkClick)
      );
      
      return cleanup;
    }
  }, [editor, editable, onLinkClick, handleWikiLinkClick]);

  // Обновляем вики-ссылки при переименовании заметок
  useEffect(() => {
    if (!editor || !noteId) return;
    
    if (validateLinks) {
      validateLinks(editor);
    }
  }, [editor, noteId, validateLinks]);

  // Обработчик изменения цвета текста
  const handleColorSelect = (color: string) => {
    if (onColorChange) {
      onColorChange(color);
    }
  };

  return (
    <div className="tiptap-editor border rounded-md bg-background relative">
      {editor && editable && (
        <EnhancedMenuBar 
          editor={editor} 
          noteId={noteId} 
          onColorSelect={handleColorSelect} 
        />
      )}
      
      {/* Bubble Menu для выделенного текста */}
      {editor && editable && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <BubbleMenuComponent editor={editor} />
        </BubbleMenu>
      )}
      
      {/* Floating Menu для пустых строк */}
      {editor && editable && (
        <FloatingMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <FloatingMenuComponent editor={editor} />
        </FloatingMenu>
      )}
      
      <EditorContent
        editor={editor}
        className="prose prose-sm dark:prose-invert max-w-none p-4"
      />
    </div>
  );
};

export default TipTapEditor;
