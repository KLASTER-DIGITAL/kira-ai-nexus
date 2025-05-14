import React, { useEffect, useRef } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import { MenuBar } from "./TipTapMenuBar";
import { useWikiLinks } from "@/hooks/notes/useWikiLinks";
import { useEditorConfig } from "@/hooks/notes/useEditorConfig";
import { addWikiLinkClickHandlers } from "./extensions/wikiLinkUtils";

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  editable?: boolean;
  noteId?: string;
  onLinkClick?: (noteId: string) => void;
  onNoteCreated?: (noteId: string) => void;
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
}) => {
  // Hooks for editor configuration and wiki links
  const { getEditorConfig } = useEditorConfig({
    content,
    onChange,
    placeholder,
    editable,
    autoFocus,
    noteId,
    onNoteCreated
  });

  const { handleWikiLinkClick, validateLinks } = useWikiLinks(noteId, onNoteCreated);
  
  // Initialize the editor with our configuration
  const editor = useEditor(getEditorConfig());
  
  // Keep a reference to the editor for cleanup
  const editorRef = useRef<Editor | null>(null);

  // Set up editor reference and click handlers for read-only mode
  useEffect(() => {
    editorRef.current = editor;
    
    // Add click handler for wiki links in read-only mode
    if (editor && !editable && onLinkClick) {
      const cleanup = addWikiLinkClickHandlers(
        editor,
        (href) => handleWikiLinkClick(href, onLinkClick)
      );
      
      return cleanup;
    }
  }, [editor, editable, onLinkClick, handleWikiLinkClick]);

  // Update wiki links when notes are renamed
  useEffect(() => {
    if (!editor || !noteId) return;
    
    validateLinks(editor);
  }, [editor, noteId, validateLinks]);

  return (
    <div className="tiptap-editor border rounded-md bg-background">
      {editor && editable && <MenuBar editor={editor} noteId={noteId} />}
      <EditorContent
        editor={editor}
        className="prose prose-sm dark:prose-invert max-w-none p-4"
      />
    </div>
  );
};

export default TipTapEditor;
