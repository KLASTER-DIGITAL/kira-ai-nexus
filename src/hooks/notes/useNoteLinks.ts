
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LinksData, LinksResult } from './links/types';

export interface CreateLinkParams {
  source_id: string;
  target_id: string;
  type: string;
}

export interface UpdateLinksParams {
  oldTitle: string;
  newTitle: string;
}

/**
 * Hook for working with note links
 */
export const useNoteLinks = (noteId?: string) => {
  const queryClient = useQueryClient();

  // Query to fetch links
  const { data: links, isLoading, error } = useQuery({
    queryKey: ['note-links', noteId],
    queryFn: async () => {
      if (!noteId) return { incomingLinks: [], outgoingLinks: [] };

      const { data: incoming, error: incomingError } = await supabase
        .from('links')
        .select('id, source_id, source:nodes!links_source_id_fkey(id, title, type)')
        .eq('target_id', noteId);

      if (incomingError) {
        throw incomingError;
      }

      const { data: outgoing, error: outgoingError } = await supabase
        .from('links')
        .select('id, target_id, target:nodes!links_target_id_fkey(id, title, type)')
        .eq('source_id', noteId);

      if (outgoingError) {
        throw outgoingError;
      }

      return {
        incomingLinks: incoming || [],
        outgoingLinks: outgoing || []
      };
    },
    enabled: !!noteId,
  });

  // Mutation to create a link
  const createLinkMutation = useMutation({
    mutationFn: async (linkData: CreateLinkParams) => {
      const { data, error } = await supabase
        .from('links')
        .insert([linkData])
        .select();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['note-links', noteId] });
      queryClient.invalidateQueries({ queryKey: ['note-links'] });
    }
  });

  // Function to create a link
  const createLink = (linkData: CreateLinkParams) => {
    createLinkMutation.mutate(linkData);
  };

  // Mutation to update links
  const updateLinksMutation = useMutation({
    mutationFn: async (data: UpdateLinksParams) => {
      // Implementation depends on your specific needs
      // This is a placeholder
      console.log("Updating links from", data.oldTitle, "to", data.newTitle);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['note-links', noteId] });
      queryClient.invalidateQueries({ queryKey: ['note-links'] });
    }
  });

  // Function to update links
  const updateLinks = (data: UpdateLinksParams) => {
    updateLinksMutation.mutate(data);
  };

  // Get all notes for link suggestions
  const { data: allNotes } = useQuery({
    queryKey: ['notes-for-links'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('nodes')
        .select('id, title, type')
        .eq('type', 'note');

      if (error) {
        throw error;
      }

      return data.map(note => ({
        id: note.id,
        title: note.title,
        type: note.type as "note" | "task" | "event"
      })) || [];
    },
  });

  return {
    links: links || { incomingLinks: [], outgoingLinks: [] },
    isLoading,
    error,
    allNotes: allNotes || [],
    createLink,
    updateLinks,
  };
};
