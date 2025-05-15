
import { supabase } from "@/integrations/supabase/client";
import { LinkData } from "./types";
import { NodeBasicInfo } from "./types";

/**
 * Fetch links for a specific node
 */
export const fetchNodeLinks = async (nodeId: string) => {
  try {
    // Fetch incoming links (where this note is the target)
    const { data: incomingLinks, error: incomingError } = await supabase
      .from("links")
      .select("*, source:nodes!links_source_id_fkey(id, title, type)")
      .eq("target_id", nodeId);

    if (incomingError) throw incomingError;

    // Fetch outgoing links (where this note is the source)
    const { data: outgoingLinks, error: outgoingError } = await supabase
      .from("links")
      .select("*, target:nodes!links_target_id_fkey(id, title, type)")
      .eq("source_id", nodeId);

    if (outgoingError) throw outgoingError;

    // Transform the data to a more usable format
    const formattedIncomingLinks = incomingLinks.map((link) => ({
      id: link.id,
      source_id: link.source_id,
      target_id: link.target_id,
      type: link.type,
      source: link.source as NodeBasicInfo
    }));

    const formattedOutgoingLinks = outgoingLinks.map((link) => ({
      id: link.id,
      source_id: link.source_id,
      target_id: link.target_id,
      type: link.type,
      target: link.target as NodeBasicInfo
    }));

    return {
      incomingLinks: formattedIncomingLinks as unknown as LinkData[],
      outgoingLinks: formattedOutgoingLinks as unknown as LinkData[]
    };
  } catch (error) {
    console.error("Error fetching node links:", error);
    return {
      incomingLinks: [],
      outgoingLinks: []
    };
  }
};

/**
 * Create a new link between nodes
 */
export const createLink = async (sourceId: string, targetId: string, type = "reference") => {
  try {
    const { data, error } = await supabase
      .from("links")
      .insert([
        {
          source_id: sourceId,
          target_id: targetId,
          type
        }
      ])
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error("Error creating link:", error);
    throw error;
  }
};

/**
 * Delete a link by ID
 */
export const deleteLink = async (linkId: string) => {
  try {
    const { error } = await supabase
      .from("links")
      .delete()
      .eq("id", linkId);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting link:", error);
    throw error;
  }
};

/**
 * Update links for a node
 */
export interface UpdateLinksParams {
  nodeId: string;
  addLinks: { targetId: string; type?: string }[];
  removeLinks: string[];
}

export const updateLinks = async ({ nodeId, addLinks, removeLinks }: UpdateLinksParams) => {
  try {
    // Add new links
    if (addLinks.length > 0) {
      const linksToAdd = addLinks.map(link => ({
        source_id: nodeId,
        target_id: link.targetId,
        type: link.type || "reference"
      }));

      const { error: addError } = await supabase
        .from("links")
        .insert(linksToAdd);

      if (addError) throw addError;
    }

    // Remove specified links
    if (removeLinks.length > 0) {
      const { error: deleteError } = await supabase
        .from("links")
        .delete()
        .in("id", removeLinks);

      if (deleteError) throw deleteError;
    }
  } catch (error) {
    console.error("Error updating links:", error);
    throw error;
  }
};
