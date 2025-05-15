
import { useCallback } from 'react';
import { Editor, Extensions } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';
import { WikiLink } from '@/components/notes/extensions/WikiLink';
import { useWikiLinks } from './useWikiLinks';
import { createWikiLinkSuggestion } from '@/components/notes/extensions/wiki-link/createWikiLinkSuggestion';
import { Extension } from '@tiptap/core';
import { Suggestion } from '@tiptap/suggestion';

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

  const getEditorConfig = useCallback(() => {
    // Create suggestion configuration for wiki links
    const wikiLinkSuggestionConfig = createWikiLinkSuggestion(fetchNotesForSuggestion, handleCreateNote);
    
    // Create a custom extension for wiki link suggestions
    // This wraps the suggestion as a proper TipTap extension
    const WikiLinkSuggestionExtension = Extension.create({
      name: 'wikiLinkSuggestion',
      addProseMirrorPlugins() {
        return [
          // Use the suggestion extension function directly
          Suggestion({
            ...wikiLinkSuggestionConfig,
            editor: this.editor, // Add editor to fix the type error
          })
        ]
      }
    });
    
    // Define extensions array
    const extensions: Extensions = [
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
      // Add our custom extension
      WikiLinkSuggestionExtension,
    ];
    
    return {
      extensions,
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

  return { getEditorConfig, validateLinks };
};
