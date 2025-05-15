
import { supabase } from "@/integrations/supabase/client";

// Create a link between two notes
export const createLink = async (sourceId: string, targetId: string, type: string = "note"): Promise<string | null> => {
  // Check if link already exists to prevent duplicates
  const { data: existingLinks } = await supabase
    .from("links")
    .select("id")
    .eq("source_id", sourceId)
    .eq("target_id", targetId);

  if (existingLinks && existingLinks.length > 0) {
    return existingLinks[0].id; // Return existing link id
  }

  const { data, error } = await supabase
    .from("links")
    .insert([
      { source_id: sourceId, target_id: targetId, type }
    ])
    .select("id")
    .single();

  if (error) {
    console.error("Error creating link:", error);
    return null;
  }

  return data.id;
};
