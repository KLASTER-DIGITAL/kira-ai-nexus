
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

export interface NoteBasicInfo {
  id: string;
  title: string;
  type: string;
}

export const useNoteLinks = (noteId?: string) => {
  const queryClient = useQueryClient();
  
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
  
  // Fetch all notes for linking
  const fetchAllNotes = async (): Promise<NoteBasicInfo[]> => {
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
  
  // Use React Query to fetch and cache the links data
  const { data: linksData, isLoading: isLinksLoading, error: linksError } = useQuery({
    queryKey: ['noteLinks', noteId],
    queryFn: fetchLinks,
    enabled: !!noteId
  });
  
  // Use React Query to fetch and cache all notes
  const { data: allNotesData, isLoading: isAllNotesLoading } = useQuery({
    queryKey: ['allNotes'],
    queryFn: fetchAllNotes
  });
  
  // Mutation to create a link between notes
  const createLinkMutation = useMutation({
    mutationFn: async ({ sourceId, targetId }: { sourceId: string; targetId: string }) => {
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
    },
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['noteLinks', noteId] });
    }
  });
  
  // Mutation to update links when notes are renamed
  const updateLinksMutation = useMutation({
    mutationFn: async ({ oldTitle, newTitle }: { oldTitle: string; newTitle: string }) => {
      // This is a placeholder for when we need to update links that might reference a note by title
      console.log(`Updating links from "${oldTitle}" to "${newTitle}"`);
      return { oldTitle, newTitle };
    },
    onSuccess: () => {
      // Invalidate to refresh data
      queryClient.invalidateQueries({ queryKey: ['noteLinks'] });
      queryClient.invalidateQueries({ queryKey: ['allNotes'] });
    }
  });
  
  return {
    links: linksData || { incomingLinks: [], outgoingLinks: [] },
    isLoading: isLinksLoading || isAllNotesLoading,
    error: linksError,
    allNotes: allNotesData || [],
    createLink: (linkData: { sourceId: string; targetId: string }) => 
      createLinkMutation.mutate(linkData),
    updateLinks: (data: { oldTitle: string; newTitle: string }) => 
      updateLinksMutation.mutate(data)
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
