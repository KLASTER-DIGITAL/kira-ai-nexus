
import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LinkData, LinksResult, CreateLinkParams, UpdateLinksParams } from "./links/types";
import { supabase } from "@/integrations/supabase/client";

export const useNoteLinks = (noteId?: string) => {
  const queryClient = useQueryClient();

  // Fetch links for a specific note
  const linksQuery = useQuery({
    queryKey: ["note-links", noteId],
    queryFn: async (): Promise<LinksResult | null> => {
      if (!noteId) return null;
      
      // Fetch incoming links
      const { data: incomingLinks, error: incomingError } = await supabase
        .from("links")
        .select(`
          id,
          source_id,
          target_id,
          type,
          source:source_id (id, title, type)
        `)
        .eq("target_id", noteId);
      
      if (incomingError) throw incomingError;
      
      // Fetch outgoing links
      const { data: outgoingLinks, error: outgoingError } = await supabase
        .from("links")
        .select(`
          id,
          source_id,
          target_id,
          type,
          target:target_id (id, title, type)
        `)
        .eq("source_id", noteId);
      
      if (outgoingError) throw outgoingError;
      
      return {
        incomingLinks: incomingLinks as LinkData[],
        outgoingLinks: outgoingLinks as LinkData[],
      };
    },
    enabled: !!noteId,
  });

  // Create a new link
  const createLinkMutation = useMutation({
    mutationFn: async (params: CreateLinkParams): Promise<void> => {
      const { sourceId, targetId, type } = params;
      
      // Check if the link already exists
      const { data: existingLink } = await supabase
        .from("links")
        .select("id")
        .eq("source_id", sourceId)
        .eq("target_id", targetId)
        .single();
      
      if (!existingLink) {
        await supabase.from("links").insert({
          source_id: sourceId,
          target_id: targetId,
          type: type || "reference",
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["note-links"] });
    },
  });

  // Update links based on content changes
  const updateLinksMutation = useMutation({
    mutationFn: async (params: UpdateLinksParams): Promise<void> => {
      const { noteId, oldTitle, newTitle, content } = params;
      
      // Logic to update links when note title changes
      console.log(`Updating links for note ${noteId}: ${oldTitle} -> ${newTitle}`);
      
      // Future implementation would parse content for wiki links
      // and update them when referenced note titles change
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["note-links"] });
    },
  });

  // Delete a link
  const deleteLinkMutation = useMutation({
    mutationFn: async (linkId: string): Promise<void> => {
      await supabase.from("links").delete().eq("id", linkId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["note-links"] });
    },
  });

  // Create a link between two notes
  const createLink = useCallback(
    (sourceId: string, targetId: string, type: string = "reference") => {
      return createLinkMutation.mutateAsync({ sourceId, targetId, type });
    },
    [createLinkMutation]
  );

  // Update links when title changes
  const updateLinks = useCallback(
    (params: UpdateLinksParams) => {
      return updateLinksMutation.mutateAsync(params);
    },
    [updateLinksMutation]
  );

  // Delete a link
  const deleteLink = useCallback(
    (linkId: string) => {
      return deleteLinkMutation.mutateAsync(linkId);
    },
    [deleteLinkMutation]
  );

  return {
    links: linksQuery.data,
    isLoading: linksQuery.isLoading,
    error: linksQuery.error,
    createLink,
    updateLinks,
    deleteLink,
  };
};
