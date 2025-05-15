
import { useQuery } from "@tanstack/react-query";
import { fetchLinks } from "../api";
import { LinkData } from "../types";

/**
 * Hook for fetching links data for a specific note
 */
export const useLinksQuery = (noteId?: string) => {
  return useQuery({
    queryKey: ['noteLinks', noteId],
    queryFn: () => fetchLinks(noteId),
    enabled: !!noteId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Format links for compatibility with existing components
 */
export const formatLinks = (linksData: { incomingLinks: LinkData[], outgoingLinks: LinkData[] } | undefined) => {
  if (!linksData) return { incomingLinks: [], outgoingLinks: [] };
  
  return {
    incomingLinks: linksData.incomingLinks.map((link: LinkData) => ({
      id: link.id,
      nodes: {
        id: link.source.id,
        title: link.source.title
      }
    })),
    outgoingLinks: linksData.outgoingLinks
  };
};
