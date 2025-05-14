
import { useCallback } from 'react';
import { Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';
import { WikiLink } from '@/components/notes/extensions/WikiLink';
import Suggestion from '@tiptap/suggestion';
import { useWikiLinks } from './useWikiLinks';
import { createWikiLinkSuggestion } from '@/components/notes/extensions/wikiLinkUtils';

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
    fetchNotesForSuggestion
  } = useWikiLinks(noteId, onNoteCreated);

  const getEditorConfig = useCallback(() => {
    const suggestionConfig = createWikiLinkSuggestion(fetchNotesForSuggestion, handleCreateNote);
    
    return {
      extensions: [
        StarterKit,
        Placeholder.configure({
          placeholder,
        }),
        Link.configure({
          openOnClick: true,
          linkOnPaste: true,
        }),
        Underline,
        Image,
        WikiLink.configure({
          validateLink: validateWikiLink
        }),
        Suggestion.configure(suggestionConfig),
      ],
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
    placeholder, 
    editable, 
    autoFocus, 
    noteId,
    validateWikiLink, 
    processWikiLinks,
    fetchNotesForSuggestion,
    handleCreateNote
  ]);

  return { getEditorConfig };
};
