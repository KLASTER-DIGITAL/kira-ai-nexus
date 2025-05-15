
import { getNoteLinks } from "./getNoteLinks";
import { supabase } from "@/integrations/supabase/client";
import { NodeBasicInfo } from "../types";

// Fetch links for a note
export const fetchLinks = async (noteId?: string) => {
  if (!noteId) return { incomingLinks: [], outgoingLinks: [] };
  
  const links = await getNoteLinks(noteId);
  return {
    incomingLinks: links.incomingLinks,
    outgoingLinks: links.outgoingLinks
  };
};

// Fetch all notes for linking
export const fetchAllNotes = async (): Promise<NodeBasicInfo[]> => {
  const { data, error } = await supabase
    .from("nodes")
    .select("id, title, type, content")
    .eq("type", "note");
  
  if (error) {
    console.error("Error fetching all notes:", error);
    return [];
  }
  
  return data.map(note => ({
    id: note.id,
    title: note.title || "",
    type: note.type || "note"
  }));
};
