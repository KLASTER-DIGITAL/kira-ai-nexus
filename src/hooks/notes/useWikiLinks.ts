
import { useCallback } from 'react';
import { Editor } from '@tiptap/react';
import { useNotesMutations } from './useNotesMutations';
import { WikiLinkItem } from '@/components/notes/extensions/wiki-link/WikiLinkSuggestion';
import { useNotes } from "../useNotes";

/**
 * Hook for handling wiki links in notes
 */
export const useWikiLinks = (noteId?: string, onNoteCreated?: (noteId: string) => void) => {
  const { notes } = useNotes({ pageSize: 100 });
  const { createNote } = useNotesMutations();

  /**
   * Create a new note from a wiki link
   */
  const handleCreateNote = useCallback(async (title: string) => {
    try {
      // Create a new note
      const newNote = await createNote({
        title,
        content: '',
        tags: [],
      });
      
      if (newNote && newNote.id) {
        // Notify parent component that a new note was created
        if (onNoteCreated) {
          onNoteCreated(newNote.id);
        }
        
        return {
          id: newNote.id,
          title: newNote.title,
          type: 'note'
        };
      }
      
      throw new Error('Failed to create note');
    } catch (error) {
      console.error('Error creating note from wiki link:', error);
      throw error;
    }
  }, [createNote, onNoteCreated]);

  /**
   * Validate if a wiki link refers to a valid note
   */
  const validateWikiLink = useCallback((href: string): boolean => {
    if (!notes) return false;
    return notes.some(note => note.id === href);
  }, [notes]);

  /**
   * Process wiki links in the editor and extract them
   */
  const processWikiLinks = useCallback((editor: Editor) => {
    // This would extract and process wiki links from the editor content
    // Functionality can be extended later if needed
  }, []);

  /**
   * Validate all wiki links in the editor content
   */
  const validateLinks = useCallback((editor: Editor) => {
    if (!editor) return;
    
    // Find all wiki links in the document and validate them
    editor.state.doc.descendants((node, pos) => {
      if (node.type.name === 'wikiLink') {
        const href = node.attrs.href;
        const isValid = validateWikiLink(href);
        
        // Update link validity if needed
        if (node.attrs.isValid !== isValid) {
          // Use a transaction to update the node attributes
          const { tr } = editor.view.state;
          tr.setNodeMarkup(pos, undefined, { ...node.attrs, isValid });
          editor.view.dispatch(tr);
        }
        return true;
      }
      return false;
    });
  }, [validateWikiLink]);

  /**
   * Handle click on a wiki link in read-only mode
   */
  const handleWikiLinkClick = useCallback((href: string, onLinkClick: (noteId: string) => void) => {
    if (href) {
      onLinkClick(href);
    }
  }, []);

  /**
   * Fetch notes for wiki link suggestion dropdown
   */
  const fetchNotesForSuggestion = useCallback(async (query: string): Promise<WikiLinkItem[]> => {
    if (!notes) return [];

    return notes
      .filter(note => note.title.toLowerCase().includes(query.toLowerCase()))
      .map((note, index) => ({
        id: note.id,
        title: note.title,
        index
      }))
      .slice(0, 5);
  }, [notes]);

  return {
    handleCreateNote,
    validateWikiLink,
    processWikiLinks,
    handleWikiLinkClick,
    fetchNotesForSuggestion,
    validateLinks,
    notes // Add notes to the return value for TipTapMenuBar
  };
};
