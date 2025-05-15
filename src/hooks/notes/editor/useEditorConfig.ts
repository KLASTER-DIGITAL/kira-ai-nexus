
import { useCallback } from "react";
import { Editor } from "@tiptap/react";
import { useEditorExtensions } from "./useEditorExtensions";
import { useWikiLinkExtensions } from "./useWikiLinkExtensions";
import { useWikiLinks } from "../links/useWikiLinks";

interface UseEditorConfigOptions {
  content?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  editable?: boolean;
  autoFocus?: boolean;
  noteId?: string;
  onNoteCreated?: (noteId: string) => void;
}

export const useEditorConfig = (options: UseEditorConfigOptions = {}) => {
  const {
    content = "",
    onChange = () => {},
    placeholder = "Начните писать...",
    editable = true,
    autoFocus = false,
    noteId,
    onNoteCreated,
  } = options;

  // Get wiki links functionality
  const wikiLinks = useWikiLinks(noteId);
  
  // Get base extensions for the editor
  const baseExtensions = useEditorExtensions(placeholder);
  
  // Get wiki link specific extensions
  const wikiLinkExtensions = useWikiLinkExtensions({
    noteId,
    onNoteCreated,
    allNotes: wikiLinks.allNotes
  });

  // Combine all extensions
  const extensions = [
    ...baseExtensions,
    ...wikiLinkExtensions,
  ];

  // Configure editor
  const getEditorConfig = useCallback(() => {
    return {
      extensions,
      content,
      editable,
      autofocus: autoFocus,
      onUpdate: ({ editor }: { editor: Editor }) => {
        onChange(editor.getHTML());
      },
    };
  }, [content, extensions, editable, autoFocus, onChange]);

  // Validate links in the editor
  const validateLinks = useCallback((editor: Editor) => {
    // The logic would be handled by wikiLinks
    console.log("Validating links in editor");
    // This function would be implemented in the wiki link extensions
  }, []);

  return {
    getEditorConfig,
    validateLinks,
  };
};
