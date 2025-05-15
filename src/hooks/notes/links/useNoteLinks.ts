
import { NodeBasicInfo } from "./types";
import { useLinksQuery, formatLinks, useLinksAllNotes, useLinksMutation } from "./hooks";

/**
 * Hook for managing note links
 */
export const useNoteLinks = (noteId?: string) => {
  // Use our separated hooks
  const { data: linksData, isLoading: isLinksLoading, error: linksError } = useLinksQuery(noteId);
  const { data: allNotesData, isLoading: isAllNotesLoading } = useLinksAllNotes();
  const { createLink, updateLinks } = useLinksMutation(noteId);
  
  // Format links for compatibility with existing components
  const formattedLinks = formatLinks(linksData);
  
  return {
    links: formattedLinks,
    rawLinks: linksData || { incomingLinks: [], outgoingLinks: [] },
    isLoading: isLinksLoading || isAllNotesLoading,
    error: linksError,
    allNotes: allNotesData || [],
    createLink,
    updateLinks
  };
};
