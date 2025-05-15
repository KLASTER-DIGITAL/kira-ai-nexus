
// Define the basic types for note links

export interface NodeBasicInfo {
  id: string;
  title: string;
  type: "note" | "task" | "event";
  tags?: string[];
  content?: string;
}

export interface LinkInfo {
  id: string;
  source_id: string;
  target_id: string;
  type: string;
  source?: NodeBasicInfo;
  target?: NodeBasicInfo;
}

export interface LinksData {
  sourceId: string;
  targetId: string;
  type?: string;
}

export interface LinksResult {
  incomingLinks: LinkInfo[];
  outgoingLinks: LinkInfo[];
}

export interface CreateLinkParams {
  source_id: string;
  target_id: string;
  type: string;
}

export interface UpdateLinksParams {
  oldTitle: string;
  newTitle: string;
}

export interface NodeLink {
  id: string;
  source_id: string;
  target_id: string;
  type?: string;
}

export interface GraphViewFilters {
  showNotes: boolean;
  showTasks: boolean;
  showEvents: boolean;
  showIsolatedNodes: boolean;
  selectedTags: string[];
}
