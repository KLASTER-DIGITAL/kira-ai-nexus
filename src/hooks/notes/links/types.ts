
import { Note } from "@/types/notes";

export interface LinkData {
  id: string;
  source_id: string;
  target_id: string;
  source: {
    id: string;
    title: string;
    type?: string;
  };
  target: {
    id: string;
    title: string;
    type?: string;
  };
}

export interface NoteLinks {
  incomingLinks: LinkData[];
  outgoingLinks: LinkData[];
  allLinkedNotes: Note[];
}

export interface NoteLink {
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

// Updated the shape of the link data for backend response
export interface LinkQueryResult {
  id: string;
  source_id: string;
  target_id: string;
  source: {
    id: string;
    title: string;
    type?: string;
  };
  target: {
    id: string;
    title: string;
    type?: string;
  };
}
