
import { supabase } from "@/integrations/supabase/client";
import { Note } from "@/types/notes";
import { LinkData, NoteLinks } from "../types";

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
      source:nodes!source_id(id, title, type)
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
      target:nodes!target_id(id, title, type)
    `)
    .eq("source_id", noteId);

  if (outgoingError) {
    console.error("Error fetching outgoing links:", outgoingError);
    return { incomingLinks: [], outgoingLinks: [], allLinkedNotes: [] };
  }

  // Transform the data to ensure it matches the LinkData type
  const incomingLinks: LinkData[] = (incomingData as any[]).map((link) => ({
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

  const outgoingLinks: LinkData[] = (outgoingData as any[]).map((link) => ({
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
      .from("nodes")
      .select("*")
      .in("id", uniqueLinkedNoteIds)
      .eq("type", "note");
    
    if (notesData) {
      // Ensure each note has at least an empty tags array
      allLinkedNotes = notesData.map(note => {
        const content = note.content as any;
        return {
          ...note,
          tags: typeof content === 'object' && content ? content.tags || [] : [],
          content: typeof content === 'object' && content ? content.content || "" : content || "",
          title: note.title,
          user_id: note.user_id,
          type: note.type
        };
      }) as Note[];
    }
  }

  return {
    incomingLinks,
    outgoingLinks,
    allLinkedNotes
  };
};
