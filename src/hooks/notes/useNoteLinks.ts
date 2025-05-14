
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth";

interface Link {
  id: string;
  source_id: string;
  target_id: string;
  type: string;
}

interface CreateLinkParams {
  sourceId: string;
  targetId: string;
  type?: string;
}

export const useNoteLinks = (noteId?: string) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Get all links for a note (both incoming and outgoing)
  const { data: links, isLoading, error } = useQuery({
    queryKey: ['note-links', noteId],
    queryFn: async () => {
      if (!noteId || !user) return { incomingLinks: [], outgoingLinks: [] };

      // Get outgoing links (where current note is the source)
      const { data: outgoingLinks, error: outgoingError } = await supabase
        .from('links')
        .select('*')
        .eq('source_id', noteId);

      if (outgoingError) {
        toast({
          title: "Ошибка при загрузке исходящих ссылок",
          description: outgoingError.message,
          variant: "destructive"
        });
        throw outgoingError;
      }

      // Get incoming links (where current note is the target)
      const { data: incomingLinks, error: incomingError } = await supabase
        .from('links')
        .select('*, nodes!links_source_id_fkey(id, title)')
        .eq('target_id', noteId);

      if (incomingError) {
        toast({
          title: "Ошибка при загрузке входящих ссылок",
          description: incomingError.message,
          variant: "destructive"
        });
        throw incomingError;
      }

      return {
        outgoingLinks: outgoingLinks as Link[],
        incomingLinks: incomingLinks as (Link & { nodes: { id: string, title: string } })[]
      };
    },
    enabled: !!noteId && !!user,
  });

  // Create a new link
  const createLinkMutation = useMutation({
    mutationFn: async ({ sourceId, targetId, type = 'wikilink' }: CreateLinkParams) => {
      const { data, error } = await supabase
        .from('links')
        .insert({
          source_id: sourceId,
          target_id: targetId,
          type
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') { // Unique violation error code
          // Link already exists, we can ignore this
          return null;
        }
        toast({
          title: "Ошибка при создании связи",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['note-links', noteId] });
      queryClient.invalidateQueries({ queryKey: ['note-links'] });
    }
  });

  // Delete a link
  const deleteLinkMutation = useMutation({
    mutationFn: async (linkId: string) => {
      const { error } = await supabase
        .from('links')
        .delete()
        .eq('id', linkId);

      if (error) {
        toast({
          title: "Ошибка при удалении связи",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['note-links', noteId] });
      queryClient.invalidateQueries({ queryKey: ['note-links'] });
    }
  });

  // Get all notes for link suggestions
  const { data: allNotes } = useQuery({
    queryKey: ['notes-for-links'],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('nodes')
        .select('id, title')
        .eq('type', 'note')
        .eq('user_id', user.id)
        .order('title', { ascending: true });

      if (error) {
        toast({
          title: "Ошибка при загрузке заметок",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }

      return data;
    },
    enabled: !!user,
  });

  return {
    links,
    isLoading,
    error,
    createLink: createLinkMutation.mutate,
    deleteLink: deleteLinkMutation.mutate,
    allNotes: allNotes || []
  };
};
