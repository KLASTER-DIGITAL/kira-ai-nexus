
import { useCallback } from 'react';
import { useNoteLinks } from './useNoteLinks';
import { useNotesMutations } from './useNotesMutations';
import { WikiLinkItem } from './types';
import { toast } from '@/hooks/use-toast';

/**
 * Hook to handle wiki link functionality in the editor
 */
export const useWikiLinks = (noteId?: string, onNoteCreated?: (noteId: string) => void) => {
  const { links, allNotes, createLink, updateLinks } = useNoteLinks(noteId);
  const { createNote } = useNotesMutations();

  /**
   * Create a new note from wiki link text
   */
  const handleCreateNote = useCallback(async (title: string): Promise<WikiLinkItem> => {
    try {
      // Create a new note with the link text as the title
      const newNote = await createNote({
        title,
        content: '',
        tags: []
      });
      
      if (!newNote || !newNote.id) {
        throw new Error("Failed to create note");
      }
      
      // If we have a source note ID, create a link between them
      if (noteId && newNote.id) {
        createLink({
          sourceId: noteId,
          targetId: newNote.id
        });
      }
      
      // Notify parent component
      if (onNoteCreated && newNote.id) {
        onNoteCreated(newNote.id);
      }
      
      toast({
        title: "Заметка создана",
        description: `Создана новая заметка "${title}"`,
      });
      
      return {
        id: newNote.id,
        title: newNote.title || title,
        type: 'note',
        index: 0 // Required by WikiLinkItem interface
      };
    } catch (error) {
      console.error("Error creating note from link:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось создать заметку",
        variant: "destructive"
      });
      throw error;
    }
  }, [noteId, createNote, createLink, onNoteCreated]);

  /**
   * Validate if a wiki link href exists in notes
   */
  const validateWikiLink = useCallback((href: string) => {
    return allNotes.some(note => note.id === href);
  }, [allNotes]);

  /**
   * Handle wiki link click events
   */
  const handleWikiLinkClick = useCallback((href: string, onLinkClick?: (noteId: string) => void) => {
    // Find the note with this ID
    const targetNote = allNotes.find((note) => 
      note.id === href || note.title.toLowerCase() === href.toLowerCase());
    
    if (targetNote && onLinkClick) {
      // If the link is valid and we have a noteId, create the link in database
      if (noteId && targetNote.id !== noteId) {
        createLink({
          sourceId: noteId,
          targetId: targetNote.id
        });
      }
      
      onLinkClick(targetNote.id);
    }
  }, [allNotes, noteId, createLink]);

  /**
   * Fetch notes for autocomplete suggestions
   */
  const fetchNotesForSuggestion = useCallback(async (query: string): Promise<WikiLinkItem[]> => {
    if (!query) return [];
    
    const lowercaseQuery = query.toLowerCase();
    return allNotes
      .filter(note => note.title.toLowerCase().includes(lowercaseQuery))
      .slice(0, 10)
      .map((note, index) => ({
        index,
        id: note.id,
        title: note.title,
        type: 'note'
      }));
  }, [allNotes]);

  /**
   * Process and extract wiki links from editor content
   */
  const processWikiLinks = useCallback((editor: any) => {
    if (!noteId) return;
    
    const wikiLinks: Array<{href: string, label: string, isValid: boolean}> = [];
    
    editor.state.doc.descendants((node: any, pos: number) => {
      const marks = node.marks.filter((mark: any) => mark.type.name === 'wikiLink');
      
      if (marks.length > 0) {
        for (const mark of marks) {
          wikiLinks.push({
            href: mark.attrs.href,
            label: mark.attrs.label || mark.attrs.href,
            isValid: mark.attrs.isValid !== false
          });
        }
      }
      
      // Also check for [[text]] format
      if (node.type.name === 'text' && node.text) {
        const regex = /\[\[(.+?)\]\]/g;
        let match;
        while ((match = regex.exec(node.text)) !== null) {
          wikiLinks.push({
            href: match[1],
            label: match[1],
            isValid: true // We don't know yet
          });
        }
      }
      
      return true;
    });
    
    // For each wiki link, find the corresponding note and create a link
    for (const link of wikiLinks) {
      const targetNote = allNotes.find(
        (note) => note.id === link.href || note.title.toLowerCase() === link.href.toLowerCase()
      );
      
      if (targetNote && targetNote.id !== noteId) {
        createLink({
          sourceId: noteId,
          targetId: targetNote.id
        });
      }
    }
  }, [noteId, allNotes, createLink]);

  /**
   * Validate wiki links in the editor
   */
  const validateLinks = useCallback((editor: any) => {
    if (!editor) return;
    
    editor.view.state.doc.descendants((node: any, pos: number) => {
      const wikiLinkMarks = node.marks.filter((mark: any) => mark.type.name === 'wikiLink');
      
      if (wikiLinkMarks.length > 0) {
        wikiLinkMarks.forEach((mark: any) => {
          const href = mark.attrs.href;
          const isValid = allNotes.some(note => note.id === href);
          
          // If validity has changed, update the mark
          if (isValid !== mark.attrs.isValid) {
            const from = pos;
            const to = pos + node.nodeSize;
            
            editor.view.dispatch(
              editor.view.state.tr.removeMark(from, to, mark.type).addMark(
                from,
                to,
                mark.type.create({
                  ...mark.attrs,
                  isValid
                })
              )
            );
          }
        });
      }
      
      return true;
    });
  }, [allNotes]);

  return {
    handleCreateNote,
    validateWikiLink,
    handleWikiLinkClick,
    fetchNotesForSuggestion,
    processWikiLinks,
    validateLinks,
    allNotes
  };
};
