
import { useCallback } from 'react';
import { Editor } from '@tiptap/react';
import { useWikiLinks } from '../useWikiLinks';
import { useEditorExtensions } from './useEditorExtensions';

interface UseEditorConfigProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  editable?: boolean;
  autoFocus?: boolean;
  noteId?: string;
  onNoteCreated?: (noteId: string) => void;
}

/**
 * Hook for configuring TipTap editor
 */
export const useEditorConfig = ({
  content,
  onChange,
  placeholder = "Начните писать...",
  editable = true,
  autoFocus = false,
  noteId,
  onNoteCreated,
}: UseEditorConfigProps) => {
  const {
    handleCreateNote,
    validateWikiLink,
    processWikiLinks,
    fetchNotesForSuggestion,
    validateLinks
  } = useWikiLinks(noteId, onNoteCreated);

  // Get editor extensions
  const { getExtensions } = useEditorExtensions(
    placeholder,
    validateWikiLink,
    fetchNotesForSuggestion,
    handleCreateNote
  );

  /**
   * Create the editor configuration object
   */
  const getEditorConfig = useCallback(() => {
    return {
      extensions: getExtensions(),
      content,
      editable,
      onUpdate: ({ editor }: { editor: Editor }) => {
        onChange(editor.getHTML());
        
        // Process and extract wiki links from content after each update
        if (noteId) {
          processWikiLinks(editor);
        }
      },
      autofocus: autoFocus,
    };
  }, [
    content, 
    onChange, 
    editable, 
    autoFocus, 
    noteId,
    getExtensions,
    processWikiLinks
  ]);

  return { getEditorConfig, validateLinks };
};

