import { Node, Edge } from "@xyflow/react";
import { Note } from "@/types/notes";

export type GraphNode = Node<{
  title: string;
  type: string;
  nodeType?: string;
  tags?: string[];
}>;

export type GraphEdge = Edge<{
  type?: string;
}>;

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

/**
 * Generate nodes and edges for the graph view
 */
export const generateNodesAndEdges = (
  notes: Note[] = [], 
  links: any[] = [],
  centerNodeId?: string
): GraphData => {
  if (!notes.length) {
    return { nodes: [], edges: [] };
  }

  // Create nodes
  const nodes: GraphNode[] = notes.map((note, index) => {
    const isCenter = note.id === centerNodeId;
    
    // Position nodes in a circle around the center
    const angle = (index / notes.length) * 2 * Math.PI;
    const radius = isCenter ? 0 : 300;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    
    return {
      id: note.id,
      position: { x: isCenter ? 0 : x, y: isCenter ? 0 : y },
      data: {
        title: note.title,
        type: note.type || 'note',
        nodeType: getNodeTypeFromTags(note.tags),
        tags: note.tags
      },
      type: getNodeTypeComponent(note.type || 'note'),
    };
  });
  
  // Create edges
  const edges: GraphEdge[] = links.map((link, index) => ({
    id: link.id || `e-${index}`,
    source: link.source_id,
    target: link.target_id,
    data: {
      type: link.type
    },
    type: 'default',
    animated: false,
  }));
  
  return { nodes, edges };
};

/**
 * Determine the node type from tags
 */
export const getNodeTypeFromTags = (tags?: string[]): string => {
  if (!tags || !Array.isArray(tags)) return 'default';
  
  const tagsString = tags.join(',').toLowerCase();
  
  if (tagsString.includes('task')) return 'task';
  if (tagsString.includes('event')) return 'event';
  if (tagsString.includes('project')) return 'project';
  
  return 'note';
};

/**
 * Get the component type for a node based on its type
 */
export const getNodeTypeComponent = (type?: string): string => {
  switch (type) {
    case 'task':
      return 'taskNode';
    case 'event':
      return 'eventNode';
    default:
      return 'noteNode';
  }
};

/**
 * Filter graph data based on search query and selected tags
 */
export const filterGraphData = (
  data: GraphData,
  searchQuery?: string,
  selectedTags?: string[]
): GraphData => {
  if (!searchQuery && (!selectedTags || !selectedTags.length)) {
    return data;
  }
  
  // Filter nodes based on search query and tags
  const filteredNodes = data.nodes.filter((node) => {
    const matchesSearch = !searchQuery || 
      node.data.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTags = !selectedTags?.length || 
      selectedTags.some(tag => node.data.tags?.includes(tag));
    
    return matchesSearch && matchesTags;
  });
  
  // Only keep edges where both nodes are in the filtered set
  const filteredNodeIds = filteredNodes.map(node => node.id);
  const filteredEdges = data.edges.filter((edge) => {
    return filteredNodeIds.includes(edge.source) && 
           filteredNodeIds.includes(edge.target);
  });
  
  return {
    nodes: filteredNodes,
    edges: filteredEdges
  };
};

/**
 * Get the related node IDs from a central node
 */
export const getRelatedNodeIds = (
  nodeId: string,
  edges: GraphEdge[],
  depth: number = 1
): string[] => {
  if (depth <= 0) return [];
  
  const directlyConnected = edges
    .filter(edge => edge.source === nodeId || edge.target === nodeId)
    .map(edge => edge.source === nodeId ? edge.target : edge.source);
  
  if (depth === 1) {
    return [...new Set([nodeId, ...directlyConnected])];
  }
  
  // For deeper connections, recursively find related nodes
  const nextLevel = directlyConnected.flatMap(id => 
    getRelatedNodeIds(id, edges, depth - 1)
  );
  
  return [...new Set([nodeId, ...directlyConnected, ...nextLevel])];
};
