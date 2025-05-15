
import { useQuery } from "@tanstack/react-query";
import { getNoteLinks } from "./links/linksApi";
import { NoteLinks, LinkData } from "./links/types";

// Format for displaying backlinks in the UI
export interface FormattedNoteLink {
  id: string;
  source: {
    id: string;
    title: string;
  };
  target: {
    id: string;
    title: string;
  };
}

export const useNoteLinks = (noteId?: string) => {
  const { data, isPending, error } = useQuery({
    queryKey: ['noteLinks', noteId],
    queryFn: () => getNoteLinks(noteId || ''),
    enabled: !!noteId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Format links for use in components that expect a different format
  const formatLinks = (links?: NoteLinks) => {
    if (!links) return { incomingLinks: [], outgoingLinks: [], backlinks: [] };
    
    const backlinks = links.incomingLinks.map((link: LinkData) => ({
      id: link.id,
      source: {
        id: link.source.id,
        title: link.source.title
      },
      target: {
        id: link.target_id,
        title: "" // Not needed as this is the current note
      }
    }));
    
    return {
      incomingLinks: links.incomingLinks,
      outgoingLinks: links.outgoingLinks,
      backlinks
    };
  };
  
  const formattedData = formatLinks(data);

  return {
    links: data,
    formattedLinks: formattedData,
    isLoading: isPending,
    error
  };
};
