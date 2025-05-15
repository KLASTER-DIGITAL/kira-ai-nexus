
// Types related to note links and relationships

/**
 * Represents a link between notes
 */
export interface NoteLink {
  id: string;
  nodes: {
    id: string;
    title: string;
  };
}

/**
 * Result of a links query containing incoming and outgoing links
 */
export interface LinksResult {
  incomingLinks: NoteLink[];
  outgoingLinks: NoteLink[];
}

/**
 * Basic note information used for linking
 */
export interface NoteBasicInfo {
  id: string;
  title: string;
  type: string;
  index?: number;
}

/**
 * Parameters for creating links between notes
 */
export interface CreateLinkParams {
  sourceId: string;
  targetId: string;
}

/**
 * Parameters for updating links when notes are renamed
 */
export interface UpdateLinksParams {
  oldTitle: string;
  newTitle: string;
}
