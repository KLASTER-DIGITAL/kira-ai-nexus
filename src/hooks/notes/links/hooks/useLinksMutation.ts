
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLink } from "../api";
import { CreateLinkParams, UpdateLinksParams } from "../types";

/**
 * Hook for managing link creation and updates
 */
export const useLinksMutation = (noteId?: string) => {
  const queryClient = useQueryClient();
  
  // Mutation to create a link between notes
  const createLinkMutation = useMutation({
    mutationFn: async (params: CreateLinkParams) => {
      return await createLink(params.sourceId, params.targetId, params.type || 'note');
    },
    onSuccess: () => {
      // Invalidate queries to refresh data
      if (noteId) {
        queryClient.invalidateQueries({ queryKey: ['noteLinks', noteId] });
      }
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

  return {
    createLinkMutation,
    updateLinksMutation,
    createLink: (sourceId: string, targetId: string, type?: string) => 
      createLinkMutation.mutate({ sourceId, targetId, type }),
    updateLinks: (oldTitle: string, newTitle: string) => 
      updateLinksMutation.mutate({ oldTitle, newTitle })
  };
};
