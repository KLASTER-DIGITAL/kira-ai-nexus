
// Types related to note links and relationships

/**
 * Represents a link between nodes (notes, tasks, events)
 */
export interface NodeLink {
  id: string;
  source_id: string;
  target_id: string;
  type: string;
  nodes?: {
    id: string;
    title: string;
    type: string;
  };
}

/**
 * Result of a links query containing incoming and outgoing links
 */
export interface LinksResult {
  incomingLinks: NodeLink[];
  outgoingLinks: NodeLink[];
}

/**
 * Basic node information used for linking
 */
export interface NodeBasicInfo {
  id: string;
  title: string;
  type: string;
  index?: number;
  tags?: string[];
  color?: string;
  content?: string;
}

/**
 * Parameters for creating links between nodes
 */
export interface CreateLinkParams {
  sourceId: string;
  targetId: string;
  type?: string;
}

/**
 * Parameters for updating links when nodes are renamed
 */
export interface UpdateLinksParams {
  oldTitle: string;
  newTitle: string;
}

/**
 * Graph node shape for visualization
 */
export enum NodeShape {
  NOTE = 'circle',
  TASK = 'square',
  EVENT = 'triangle',
  DEFAULT = 'circle'
}

/**
 * Graph view settings
 */
export interface GraphViewSettings {
  showNotes: boolean;
  showTasks: boolean;
  showEvents: boolean;
  showIsolatedNodes: boolean;
  selectedTags: string[];
  layout: 'force' | 'radial' | 'hierarchical';
  savedPositions?: Record<string, {x: number, y: number}>;
}

/**
 * Graph view filter options
 */
export interface GraphViewFilters {
  nodeTypes: string[];
  searchTerm: string;
  tags: string[];
  showIsolatedNodes: boolean;
}
