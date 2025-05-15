
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface NoteLink {
  id: string;
  source: {
    id: string;
    title: string;
  };
}

/**
 * Hook for managing note links
 */
export const useNoteLinks = (noteId?: string) => {
  const [links, setLinks] = useState<{
    incomingLinks: NoteLink[];
    outgoingLinks: any[];
  }>({
    incomingLinks: [],
    outgoingLinks: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch links when noteId changes
  useEffect(() => {
    if (!noteId) return;

    const fetchLinks = async () => {
      setIsLoading(true);
      try {
        // Fetch incoming links
        const { data: incomingData, error: incomingError } = await supabase
          .from("links")
          .select(`
            id,
            nodes!links_source_id_fkey (
              id, 
              title
            )
          `)
          .eq("target_id", noteId);

        if (incomingError) throw incomingError;

        // Fetch outgoing links
        const { data: outgoingData, error: outgoingError } = await supabase
          .from("links")
          .select(`
            id,
            nodes!links_target_id_fkey (
              id, 
              title
            )
          `)
          .eq("source_id", noteId);

        if (outgoingError) throw outgoingError;

        setLinks({
          incomingLinks: incomingData || [],
          outgoingLinks: outgoingData || []
        });
      } catch (err) {
        console.error("Error fetching note links:", err);
        setError(err instanceof Error ? err : new Error("Failed to fetch note links"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchLinks();
  }, [noteId]);

  // Create link between two notes
  const createLink = async (sourceId: string, targetId: string) => {
    try {
      const { error } = await supabase
        .from("links")
        .insert([
          {
            source_id: sourceId,
            target_id: targetId,
            type: "note"
          }
        ]);

      if (error) throw error;
    } catch (err) {
      console.error("Error creating link:", err);
      throw err;
    }
  };

  return { links, isLoading, error, createLink };
};
