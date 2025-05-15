
import { useCallback } from 'react';
import { useNotesMutations } from '../useNotesMutations';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

/**
 * Hook for handling creation of notes from wiki links
 */
export const useWikiLinkCreation = (onNoteCreated?: (noteId: string) => void) => {
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
          type: 'note',
          index: 0 // Add index to match WikiLinkItem type
        };
      }
      
      throw new Error('Failed to create note');
    } catch (error) {
      console.error('Error creating note from wiki link:', error);
      throw error;
    }
  }, [createNote, onNoteCreated]);
  
  /**
   * Create a link between two nodes
   */
  const createNodeLink = useCallback(async (sourceId: string, targetId: string, type: string = 'wikilink') => {
    try {
      // Check if the link already exists to prevent duplicates
      const { data: existingLink, error: checkError } = await supabase
        .from('links')
        .select('id')
        .eq('source_id', sourceId)
        .eq('target_id', targetId)
        .eq('type', type)
        .maybeSingle();
        
      if (checkError) {
        console.error('Error checking existing link:', checkError);
        return null;
      }
      
      // If link already exists, return it
      if (existingLink) return existingLink;
      
      // Create the new link
      const { data, error } = await supabase
        .from('links')
        .insert({
          source_id: sourceId,
          target_id: targetId,
          type
        })
        .select('id')
        .single();
        
      if (error) {
        console.error('Error creating link:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error creating node link:', error);
      return null;
    }
  }, []);
  
  /**
   * Process wiki links from content and create links in the database
   */
  const processContentLinks = useCallback(async (sourceId: string, content: string) => {
    try {
      // Find all wiki links in format [[title]]
      const wikiLinkRegex = /\[\[(.*?)\]\]/g;
      const matches = [...content.matchAll(wikiLinkRegex)];
      
      if (matches.length === 0) return;
      
      // Get all linked titles
      const linkedTitles = matches.map(match => match[1]);
      
      // Find existing notes with these titles
      const { data: existingNotes, error } = await supabase
        .from('nodes')
        .select('id, title')
        .in('title', linkedTitles)
        .eq('type', 'note');
        
      if (error) {
        console.error('Error fetching existing notes:', error);
        return;
      }
      
      // Create links for existing notes
      const createdLinks = await Promise.all(
        existingNotes.map(note => createNodeLink(sourceId, note.id, 'wikilink'))
      );
      
      // Check which titles don't have corresponding notes
      const existingTitles = new Set(existingNotes.map(note => note.title));
      const missingTitles = linkedTitles.filter(title => !existingTitles.has(title));
      
      // Create new notes for missing titles if needed
      // This could be enabled as a user preference
      // For now, we'll just log the missing titles
      if (missingTitles.length > 0) {
        console.log('Missing notes for titles:', missingTitles);
      }
      
      return createdLinks.filter(Boolean);
    } catch (error) {
      console.error('Error processing content links:', error);
      return [];
    }
  }, [createNodeLink]);

  return { 
    handleCreateNote,
    createNodeLink,
    processContentLinks
  };
};
