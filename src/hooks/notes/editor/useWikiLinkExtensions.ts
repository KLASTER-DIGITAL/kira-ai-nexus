
import { useCallback } from 'react';
import { Extension } from '@tiptap/core';
import { Suggestion } from '@tiptap/suggestion';
import { createWikiLinkSuggestion } from '@/components/notes/extensions/wiki-link/createWikiLinkSuggestion';

/**
 * Hook for configuring wiki link related extensions for the TipTap editor
 */
export const useWikiLinkExtensions = (
  fetchNotesForSuggestion: (query: string) => Promise<any[]>,
  handleCreateNote: (title: string) => Promise<any>
) => {
  /**
   * Create a custom extension for wiki link suggestions
   */
  const createWikiLinkSuggestionExtension = useCallback(() => {
    // Create suggestion configuration for wiki links
    const wikiLinkSuggestionConfig = createWikiLinkSuggestion(
      fetchNotesForSuggestion, 
      handleCreateNote
    );
    
    // This wraps the suggestion as a proper TipTap extension
    return Extension.create({
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
  }, [fetchNotesForSuggestion, handleCreateNote]);

  return { createWikiLinkSuggestionExtension };
};
