
import { Node, Edge } from '@xyflow/react';
import { Note } from '@/types/notes';

/**
 * Calculate position for nodes in a circular layout
 */
export const calculateNodePosition = (
  index: number,
  total: number,
  centerX: number,
  centerY: number,
  radius: number
) => {
  if (total === 1) {
    return { x: centerX, y: centerY };
  }

  const angle = (index / total) * 2 * Math.PI;
  const x = centerX + radius * Math.cos(angle);
  const y = centerY + radius * Math.sin(angle);

  return { x, y };
};

/**
 * Generate a color based on node type or tag
 */
export const getNodeColor = (type: string, tags?: string[]) => {
  const baseColors = {
    note: '#9b87f5',
    task: '#10B981',
    event: '#60A5FA',
    default: '#6B7280'
  };

  // If it's a note with tags, use the first tag to influence the color
  if (type === 'note' && tags && tags.length > 0) {
    // Simple hash function to get consistent colors
    const tag = tags[0];
    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
      hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Convert to HSL color with fixed saturation and lightness
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 80%, 65%)`;
  }

  return baseColors[type as keyof typeof baseColors] || baseColors.default;
};

/**
 * Prepare nodes and edges for the graph visualization
 */
export const generateNodesAndEdges = (
  nodes: any[],
  links: any[],
  showTags: boolean = true,
  centerX: number = 0,
  centerY: number = 0
): { nodes: Node[]; edges: Edge[] } => {
  if (!nodes || !links) {
    return { nodes: [], edges: [] };
  }

  // Generate nodes
  const graphNodes: Node[] = nodes.map((node, index) => {
    const position = calculateNodePosition(
      index,
      nodes.length,
      centerX,
      centerY,
      200
    );

    const nodeData = {
      title: node.title,
      type: node.type || 'note',
      content: node.content,
      tags: node.tags || [],
      created_at: node.created_at,
      updated_at: node.updated_at
    };

    // Set the appropriate node type
    let nodeType = 'noteNode';
    if (node.type === 'task') nodeType = 'taskNode';
    if (node.type === 'event') nodeType = 'eventNode';

    // Get node color based on type and tags
    const color = getNodeColor(
      node.type || 'note',
      showTags ? node.tags : undefined
    );

    return {
      id: node.id,
      type: nodeType,
      position,
      data: {
        ...nodeData,
        label: node.title,
        color,
      },
      style: {
        background: color,
        borderColor: color,
      },
    };
  });

  // Generate edges
  const graphEdges: Edge[] = links.map((link) => {
    const type = typeof link.type === 'string' ? link.type.toLowerCase() : 'default';
    
    return {
      id: link.id,
      source: link.source_id,
      target: link.target_id,
      type: 'smoothstep',
      animated: type === 'reference',
      style: {
        stroke: type === 'reference' ? '#9b87f5' : '#6B7280',
      },
      data: {
        type: type,
      },
    };
  });

  return { nodes: graphNodes, edges: graphEdges };
};

/**
 * Filter nodes based on search query
 */
export const filterNodesByQuery = (nodes: Node[], searchQuery: string): Node[] => {
  if (!searchQuery) return nodes;
  
  const query = searchQuery.toLowerCase();
  
  return nodes.filter((node) => {
    const title = node.data.title.toLowerCase();
    const tags = node.data.tags || [];
    
    const matchesTitle = title.includes(query);
    const matchesTags = tags.some((tag: string) => 
      tag.toLowerCase().includes(query)
    );
    
    return matchesTitle || matchesTags;
  });
};

/**
 * Filter nodes by type
 */
export const filterNodesByType = (nodes: Node[], nodeTypes: string[]): Node[] => {
  if (!nodeTypes.length) return nodes;
  
  return nodes.filter((node) => nodeTypes.includes(node.data.type));
};

/**
 * Filter nodes by tags
 */
export const filterNodesByTags = (nodes: Node[], selectedTags: string[]): Node[] => {
  if (!selectedTags.length) return nodes;
  
  return nodes.filter((node) => {
    const nodeTags = node.data.tags || [];
    return selectedTags.some(tag => nodeTags.includes(tag));
  });
};
