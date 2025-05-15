
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LinksResult, NoteBasicInfo, CreateLinkParams, UpdateLinksParams } from "./types";
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
    mutationFn: async ({ sourceId, targetId }: CreateLinkParams) => {
      return await createLink(sourceId, targetId);
    },
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['noteLinks', noteId] });
    }
  });
  
  // Mutation to update links when notes are renamed
  const updateLinksMutation = useMutation({
    mutationFn: async ({ oldTitle, newTitle }: UpdateLinksParams) => {
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
    createLink: (linkData: CreateLinkParams) => createLinkMutation.mutate(linkData),
    updateLinks: (data: UpdateLinksParams) => updateLinksMutation.mutate(data)
  };
};
