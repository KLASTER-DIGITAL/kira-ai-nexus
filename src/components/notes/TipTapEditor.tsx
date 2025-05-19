
import React, { useEffect, useRef } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import { useEditorConfig } from "@/hooks/notes/editor/useEditorConfig";
import { useWikiLinks } from "@/hooks/notes/links/useWikiLinks";
import { addWikiLinkClickHandlers } from "./extensions/wiki-link/WikiLinkClickHandler";
import EnhancedMenuBar from "./menubar/EnhancedMenuBar";
import TextAlign from '@tiptap/extension-text-align';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import "../styles/tiptap.css";

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
  
  // Расширенные возможности редактора
  const editorConfig = {
    ...getEditorConfig(),
    extensions: [
      ...(getEditorConfig().extensions || []),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
        defaultAlignment: 'left',
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
      Color,
      TextStyle,
    ]
  };
  
  // Инициализируем редактор с расширенной конфигурацией
  const editor = useEditor(editorConfig);
  
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

  return (
    <div className="tiptap-editor border rounded-md bg-background">
      {editor && editable && <EnhancedMenuBar editor={editor} onColorSelect={onColorChange} />}
      <EditorContent
        editor={editor}
        className="prose prose-sm dark:prose-invert max-w-none p-4"
      />
    </div>
  );
};

export default TipTapEditor;
