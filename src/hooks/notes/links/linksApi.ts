
import { supabase } from "@/integrations/supabase/client";
import { LinksResult, NoteBasicInfo } from "./types";

/**
 * Fetch links for a specific note
 */
export const fetchLinks = async (noteId?: string): Promise<LinksResult> => {
  if (!noteId) {
    return { incomingLinks: [], outgoingLinks: [] };
  }
  
  // Fetch incoming links (notes that link to this note)
  const { data: incomingLinks, error: incomingError } = await supabase
    .from('links')
    .select('id, nodes!links_target_id_fkey(id, title)')
    .eq('target_id', noteId);
    
  if (incomingError) {
    console.error("Error fetching incoming links:", incomingError);
    throw incomingError;
  }
  
  // Fetch outgoing links (notes that this note links to)
  const { data: outgoingLinks, error: outgoingError } = await supabase
    .from('links')
    .select('id, nodes!links_target_id_fkey(id, title)')
    .eq('source_id', noteId);
    
  if (outgoingError) {
    console.error("Error fetching outgoing links:", outgoingError);
    throw outgoingError;
  }
  
  return {
    incomingLinks: incomingLinks || [],
    outgoingLinks: outgoingLinks || []
  };
};

/**
 * Fetch all notes that can be linked
 */
export const fetchAllNotes = async (): Promise<NoteBasicInfo[]> => {
  const { data, error } = await supabase
    .from('nodes')
    .select('id, title, type')
    .eq('type', 'note');
    
  if (error) {
    console.error("Error fetching all notes:", error);
    throw error;
  }
  
  return data || [];
};

/**
 * Check if a note exists by title
 */
export const checkNoteExists = async (title: string): Promise<{ id: string; title: string } | null> => {
  const { data, error } = await supabase
    .from('nodes')
    .select('id, title')
    .ilike('title', title)
    .eq('type', 'note')
    .maybeSingle();
    
  if (error) {
    console.error("Error checking note existence:", error);
    return null;
  }
  
  return data as { id: string; title: string } | null;
};

/**
 * Search notes by partial title match
 */
export const searchNotesByTitle = async (query: string): Promise<Array<NoteBasicInfo>> => {
  if (!query || query.length < 2) {
    return [];
  }
  
  const { data, error } = await supabase
    .from('nodes')
    .select('id, title, type')
    .ilike('title', `%${query}%`)
    .eq('type', 'note')
    .limit(10);
    
  if (error) {
    console.error("Error searching notes:", error);
    return [];
  }
  
  return data.map((item, index) => ({
    index,
    id: item.id,
    title: item.title,
    type: item.type
  }));
};

/**
 * Create a link between two notes
 */
export const createLink = async (sourceId: string, targetId: string) => {
  // Check if link already exists to avoid duplicates
  const { data: existingLinks, error: checkError } = await supabase
    .from('links')
    .select('id')
    .eq('source_id', sourceId)
    .eq('target_id', targetId)
    .maybeSingle();
    
  if (checkError) {
    console.error("Error checking existing links:", checkError);
    throw checkError;
  }
  
  // If link doesn't exist, create it
  if (!existingLinks) {
    const { data, error } = await supabase
      .from('links')
      .insert({
        source_id: sourceId,
        target_id: targetId,
        type: 'note_link'
      })
      .select('id');
      
    if (error) {
      console.error("Error creating link:", error);
      throw error;
    }
    
    return data[0];
  }
  
  return existingLinks;
};
