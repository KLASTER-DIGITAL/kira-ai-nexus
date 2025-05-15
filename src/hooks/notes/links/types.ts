export interface GraphViewSettings {
  showNotes: boolean;
  showTasks: boolean;
  showEvents: boolean;
  showIsolatedNodes: boolean;
  selectedTags: string[];
  layout: 'force' | 'radial' | 'hierarchical';
  savedPositions: Record<string, {x: number, y: number}>;
}

export interface GraphViewFilters {
  nodeTypes?: string[];
  searchTerm?: string;
  tags?: string[];
  showIsolatedNodes?: boolean;
}

export interface NodeBasicInfo {
  id: string;
  title: string;
  type: string;
  content?: string;
  tags?: string[];
  [key: string]: any;  // Allow for additional properties based on node type
}

export interface NodeLink {
  id?: string;
  source_id: string;
  target_id: string;
  type: string;
}

export interface NodeShape {
  type: string;
  color: string;
  icon: string;
}
