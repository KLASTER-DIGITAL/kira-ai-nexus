
import { supabase } from "@/integrations/supabase/client";

// Delete a link between two notes
export const deleteLink = async (linkId: string): Promise<boolean> => {
  const { error } = await supabase
    .from("links")
    .delete()
    .eq("id", linkId);

  if (error) {
    console.error("Error deleting link:", error);
    return false;
  }

  return true;
};

// Delete all links for a specific note
export const deleteAllLinksForNote = async (noteId: string): Promise<boolean> => {
  // Delete where note is source
  const { error: sourceError } = await supabase
    .from("links")
    .delete()
    .eq("source_id", noteId);

  if (sourceError) {
    console.error("Error deleting source links:", sourceError);
    return false;
  }

  // Delete where note is target
  const { error: targetError } = await supabase
    .from("links")
    .delete()
    .eq("target_id", noteId);

  if (targetError) {
    console.error("Error deleting target links:", targetError);
    return false;
  }

  return true;
};
