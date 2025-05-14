
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface NoteLink {
  id: string;
  nodes: {
    id: string;
    title: string;
  };
}

interface LinksResult {
  incomingLinks: NoteLink[];
  outgoingLinks: NoteLink[];
}

export const useNoteLinks = (noteId?: string) => {
  const fetchLinks = async (): Promise<LinksResult> => {
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
  
  // Use React Query to fetch and cache the data
  const { data, isLoading, error } = useQuery({
    queryKey: ['noteLinks', noteId],
    queryFn: fetchLinks,
    enabled: !!noteId
  });
  
  return {
    links: data,
    isLoading,
    error
  };
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
export const searchNotesByTitle = async (query: string): Promise<Array<{ id: string; title: string; type: string }>> => {
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
