
import { supabase } from "@/integrations/supabase/client";
import { Note } from "@/types/notes";
import { LinkData, LinkQueryResult, NoteLinks } from "./types";

// Get links for a specific note
export const getNoteLinks = async (noteId: string): Promise<NoteLinks> => {
  if (!noteId) {
    return { incomingLinks: [], outgoingLinks: [], allLinkedNotes: [] };
  }

  // Get incoming links (where the note is the target)
  const { data: incomingData, error: incomingError } = await supabase
    .from("links")
    .select(`
      id, 
      source_id, 
      target_id,
      source:source_id(id, title, type)
    `)
    .eq("target_id", noteId);

  if (incomingError) {
    console.error("Error fetching incoming links:", incomingError);
    return { incomingLinks: [], outgoingLinks: [], allLinkedNotes: [] };
  }

  // Get outgoing links (where the note is the source)
  const { data: outgoingData, error: outgoingError } = await supabase
    .from("links")
    .select(`
      id, 
      source_id, 
      target_id,
      target:target_id(id, title, type)
    `)
    .eq("source_id", noteId);

  if (outgoingError) {
    console.error("Error fetching outgoing links:", outgoingError);
    return { incomingLinks: [], outgoingLinks: [], allLinkedNotes: [] };
  }

  // Transform the data to ensure it matches the LinkData type
  const incomingLinks: LinkData[] = (incomingData as LinkQueryResult[]).map((link) => ({
    id: link.id,
    source_id: link.source_id,
    target_id: link.target_id,
    source: {
      id: link.source?.id || "",
      title: link.source?.title || "",
      type: link.source?.type
    },
    target: {
      id: noteId,
      title: "",  // We don't need target details for incoming links as we know it's the current note
      type: "note"
    }
  }));

  const outgoingLinks: LinkData[] = (outgoingData as LinkQueryResult[]).map((link) => ({
    id: link.id,
    source_id: link.source_id,
    target_id: link.target_id,
    source: {
      id: noteId,
      title: "",  // We don't need source details for outgoing links as we know it's the current note
      type: "note"
    },
    target: {
      id: link.target?.id || "",
      title: link.target?.title || "",
      type: link.target?.type
    }
  }));

  // Get all linked notes for reference
  const linkedNoteIds = [
    ...incomingLinks.map(link => link.source_id),
    ...outgoingLinks.map(link => link.target_id)
  ].filter(id => id !== noteId);
  
  const uniqueLinkedNoteIds = [...new Set(linkedNoteIds)];
  
  let allLinkedNotes: Note[] = [];
  
  if (uniqueLinkedNoteIds.length > 0) {
    const { data: notesData } = await supabase
      .from("notes")
      .select("*")
      .in("id", uniqueLinkedNoteIds);
    
    if (notesData) {
      // Ensure each note has at least an empty tags array
      allLinkedNotes = notesData.map(note => ({
        ...note,
        tags: note.tags || []
      })) as Note[];
    }
  }

  return {
    incomingLinks,
    outgoingLinks,
    allLinkedNotes
  };
};

// Create a link between two notes
export const createLink = async (sourceId: string, targetId: string): Promise<string | null> => {
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
      { source_id: sourceId, target_id: targetId }
    ])
    .select("id")
    .single();

  if (error) {
    console.error("Error creating link:", error);
    return null;
  }

  return data.id;
};

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
