
import { useCallback } from "react";
import { Editor, Extensions } from "@tiptap/react";
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
  const { validateWikiLink, fetchNotesForSuggestion, handleCreateNote, allNotes } = useWikiLinks(noteId);
  
  // Get base extensions for the editor
  const { getExtensions } = useEditorExtensions(placeholder, validateWikiLink);
  
  // Get wiki link specific extensions
  const { createWikiLinkSuggestionExtension } = useWikiLinkExtensions(
    fetchNotesForSuggestion,
    handleCreateNote
  );

  // Configure editor
  const getEditorConfig = useCallback(() => {
    // Create wiki link suggestion extension
    const WikiLinkSuggestionExtension = createWikiLinkSuggestionExtension();
    
    // Define extensions array with all needed extensions
    const extensions = [
      ...getExtensions(),
      WikiLinkSuggestionExtension,
    ];

    return {
      extensions,
      content,
      editable,
      autofocus: autoFocus,
      onUpdate: ({ editor }: { editor: Editor }) => {
        onChange(editor.getHTML());
      },
    };
  }, [content, editable, autoFocus, onChange, getExtensions, createWikiLinkSuggestionExtension]);

  // Validate links in the editor
  const validateLinks = useCallback((editor: Editor) => {
    // This function would validate wiki links in the editor
    // by checking if they correspond to existing notes
    console.log("Validating links in editor");
    // Implementation would be part of wiki link functionality
  }, []);

  return {
    getEditorConfig,
    validateLinks,
  };
};
