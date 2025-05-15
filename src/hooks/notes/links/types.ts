
import { Note } from "@/types/notes";

export interface NodeBasicInfo {
  id: string;
  title: string;
  type: 'note' | 'task' | 'event';
}

// For backward compatibility
export type NoteBasicInfo = NodeBasicInfo;

export interface Link {
  id: string;
  source: string;
  target: string;
  label?: string;
  type?: string;
}

export interface LinksResult {
  links: Link[];
  isLoading: boolean;
  error: Error | null;
  allNotes: NoteBasicInfo[];
}

export interface CreateLinkParams {
  source: string;
  target: string;
  label?: string;
  type?: string;
}

export interface UpdateLinksParams {
  noteId: string;
  links: Array<{
    targetId: string;
    label?: string;
    type?: string;
  }>;
}

export interface UseWikiLinkCreationParams {
  noteId: string;
  content: string;
}

export interface UseWikiLinksProps {
  noteId?: string;
}

export interface UseWikiLinkSuggestionsProps {
  query: string;
}

export interface UseWikiLinkNavigationProps {
  onNavigate: (linkId: string) => void;
}

export interface UseWikiLinkValidationProps {
  content: string;
}
