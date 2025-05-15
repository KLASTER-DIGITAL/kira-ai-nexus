
import { Note } from "@/types/notes";

export interface LinkData {
  id: string;
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

export interface LinksResult {
  incomingLinks: LinkData[];
  outgoingLinks: LinkData[];
}

export interface NodeBasicInfo {
  id: string;
  title: string;
  type?: string;
}

export interface CreateLinkParams {
  sourceId: string;
  targetId: string;
  type?: string;
}

export interface UpdateLinksParams {
  oldTitle: string;
  newTitle: string;
}

export interface NoteLink {
  id: string;
  source: {
    id: string;
    title: string;
  };
  target?: {
    id: string;
    title: string;
  };
}
