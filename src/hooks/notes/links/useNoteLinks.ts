
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LinkData, NodeBasicInfo, CreateLinkParams, UpdateLinksParams } from "./types";
import { fetchLinks, fetchAllNotes, createLink } from "./linksApi";

/**
 * Hook for managing note links
 */
export const useNoteLinks = (noteId?: string) => {
  const queryClient = useQueryClient();
  
  // Use React Query to fetch and cache the links data
  const { data: linksData, isLoading: isLinksLoading, error: linksError } = useQuery({
    queryKey: ['noteLinks', noteId],
    queryFn: () => fetchLinks(noteId),
    enabled: !!noteId
  });
  
  // Use React Query to fetch and cache all notes
  const { data: allNotesData, isLoading: isAllNotesLoading } = useQuery({
    queryKey: ['allNotes'],
    queryFn: fetchAllNotes
  });
  
  // Mutation to create a link between notes
  const createLinkMutation = useMutation({
    mutationFn: async (params: CreateLinkParams) => {
      return await createLink(params.sourceId, params.targetId, params.type || 'note');
    },
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['noteLinks', noteId] });
    }
  });
  
  // Mutation to update links when notes are renamed
  const updateLinksMutation = useMutation({
    mutationFn: async (params: UpdateLinksParams) => {
      // This is a placeholder for when we need to update links that might reference a note by title
      console.log(`Updating links from "${params.oldTitle}" to "${params.newTitle}"`);
      return { oldTitle: params.oldTitle, newTitle: params.newTitle };
    },
    onSuccess: () => {
      // Invalidate to refresh data
      queryClient.invalidateQueries({ queryKey: ['noteLinks'] });
      queryClient.invalidateQueries({ queryKey: ['allNotes'] });
    }
  });
  
  // Format links for compatibility with existing components
  const formattedLinks = linksData ? {
    incomingLinks: linksData.incomingLinks.map((link: LinkData) => ({
      id: link.id,
      nodes: {
        id: link.source.id,
        title: link.source.title
      }
    })),
    outgoingLinks: linksData.outgoingLinks
  } : { incomingLinks: [], outgoingLinks: [] };
  
  return {
    links: formattedLinks,
    rawLinks: linksData || { incomingLinks: [], outgoingLinks: [] },
    isLoading: isLinksLoading || isAllNotesLoading,
    error: linksError,
    allNotes: allNotesData || [],
    createLink: (sourceId: string, targetId: string, type?: string) => 
      createLinkMutation.mutate({ sourceId, targetId, type }),
    updateLinks: (oldTitle: string, newTitle: string) => 
      updateLinksMutation.mutate({ oldTitle, newTitle })
  };
};
