
import { supabase } from '@/integrations/supabase/client';
import { Note } from '@/types/notes';
import { LinksResult } from './types';

/**
 * Fetch links for a specific note
 */
export const fetchLinks = async (noteId?: string): Promise<LinksResult> => {
  if (!noteId) {
    return { incomingLinks: [], outgoingLinks: [] };
  }

  try {
    // Fetch incoming links (where the note is the target)
    const { data: incomingLinks, error: incomingError } = await supabase
      .from('links')
      .select(`
        id,
        source_id,
        target_id,
        source:source_id(id, title, type),
        target:target_id(id, title, type)
      `)
      .eq('target_id', noteId);

    // Fetch outgoing links (where the note is the source)
    const { data: outgoingLinks, error: outgoingError } = await supabase
      .from('links')
      .select(`
        id,
        source_id,
        target_id,
        source:source_id(id, title, type),
        target:target_id(id, title, type)
      `)
      .eq('source_id', noteId);

    if (incomingError || outgoingError) {
      console.error('Error fetching links:', incomingError || outgoingError);
      return { incomingLinks: [], outgoingLinks: [] };
    }

    return {
      incomingLinks: incomingLinks || [],
      outgoingLinks: outgoingLinks || []
    };
  } catch (error) {
    console.error('Error fetching links:', error);
    return { incomingLinks: [], outgoingLinks: [] };
  }
};

/**
 * Fetch all notes for linking and suggestions
 */
export const fetchAllNotes = async (): Promise<Note[]> => {
  try {
    const { data, error } = await supabase
      .from('nodes')
      .select('*')
      .eq('type', 'note');

    if (error) {
      console.error('Error fetching notes:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching notes:', error);
    return [];
  }
};

/**
 * Create a link between two notes
 */
export const createLink = async (sourceId: string, targetId: string, type: string = 'note'): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('links')
      .insert({
        source_id: sourceId,
        target_id: targetId,
        type
      })
      .select();

    if (error) {
      console.error('Error creating link:', error);
      return null;
    }

    return data[0];
  } catch (error) {
    console.error('Error creating link:', error);
    return null;
  }
};
