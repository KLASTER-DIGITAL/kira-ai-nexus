
import { Node, Edge } from '@xyflow/react';
import { LayoutType } from '@/hooks/useGraphSettings';

// Function to calculate force-directed layout
export const calculateForceLayout = (nodes: Node[], edges: Edge[]) => {
  // Simple force-directed layout algorithm
  const nodeMap = new Map();
  const nodeRadius = 100;
  const centerX = 0;
  const centerY = 0;
  
  // For large graphs, use a radial layout
  if (nodes.length > 50) {
    const angleStep = (2 * Math.PI) / nodes.length;
    nodes.forEach((node, index) => {
      const angle = index * angleStep;
      const radius = Math.sqrt(nodes.length) * nodeRadius;
      const position = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      };
      nodeMap.set(node.id, { ...node, position });
    });
  } else {
    // For smaller graphs, use a grid layout
    const gridSize = Math.ceil(Math.sqrt(nodes.length));
    nodes.forEach((node, index) => {
      const row = Math.floor(index / gridSize);
      const col = index % gridSize;
      const position = {
        x: centerX - ((gridSize - 1) * nodeRadius) / 2 + col * nodeRadius,
        y: centerY - ((gridSize - 1) * nodeRadius) / 2 + row * nodeRadius
      };
      nodeMap.set(node.id, { ...node, position });
    });
  }
  
  return { 
    nodes: Array.from(nodeMap.values()),
    edges
  };
};

// Function to calculate radial layout
export const calculateRadialLayout = (nodes: Node[], edges: Edge[]) => {
  const nodeMap = new Map();
  const centerX = 0;
  const centerY = 0;
  
  // Count connections for each node to determine importance
  const connectionCount = new Map<string, number>();
  edges.forEach(edge => {
    connectionCount.set(edge.source, (connectionCount.get(edge.source) || 0) + 1);
    connectionCount.set(edge.target, (connectionCount.get(edge.target) || 0) + 1);
  });
  
  // Sort nodes by connection count (most connected first)
  const sortedNodes = [...nodes].sort((a, b) => 
    (connectionCount.get(b.id) || 0) - (connectionCount.get(a.id) || 0)
  );
  
  // Central node
  if (sortedNodes.length > 0) {
    const centralNode = sortedNodes[0];
    nodeMap.set(centralNode.id, { 
      ...centralNode, 
      position: { x: centerX, y: centerY }
    });
  }
  
  // Position other nodes in concentric circles
  const radius = 200;
  const angleStep = (2 * Math.PI) / (sortedNodes.length - 1 || 1);
  
  sortedNodes.slice(1).forEach((node, index) => {
    const angle = index * angleStep;
    const position = {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
    nodeMap.set(node.id, { ...node, position });
  });
  
  return { 
    nodes: Array.from(nodeMap.values()),
    edges
  };
};

// Function to calculate hierarchical layout
export const calculateHierarchicalLayout = (nodes: Node[], edges: Edge[]) => {
  // Step 1: Find root nodes (nodes without incoming connections)
  const incomingConnections = new Map<string, number>();
  edges.forEach(edge => {
    incomingConnections.set(edge.target, (incomingConnections.get(edge.target) || 0) + 1);
  });
  
  const rootNodeIds = nodes
    .filter(node => !incomingConnections.has(node.id))
    .map(node => node.id);
    
  if (rootNodeIds.length === 0 && nodes.length > 0) {
    rootNodeIds.push(nodes[0].id); // If no root, use the first node
  }
  
  // Step 2: Build hierarchical levels
  const nodeMap = new Map<string, Node>();
  const levels = new Map<string, number>();
  const visited = new Set<string>();
  
  // Depth-first traversal to assign levels
  const assignLevel = (nodeId: string, level: number) => {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);
    levels.set(nodeId, Math.max(level, levels.get(nodeId) || 0));
    
    const outgoingEdges = edges.filter(edge => edge.source === nodeId);
    for (const edge of outgoingEdges) {
      assignLevel(edge.target, level + 1);
    }
  };
  
  // Assign levels starting from root nodes
  rootNodeIds.forEach(nodeId => assignLevel(nodeId, 0));
  
  // Check for orphaned nodes and assign level 0
  nodes.forEach(node => {
    if (!levels.has(node.id)) {
      levels.set(node.id, 0);
    }
  });
  
  // Get max level and nodes at each level
  const maxLevel = Math.max(...Array.from(levels.values()), 0);
  const nodesAtLevel = new Map<number, Node[]>();
  
  nodes.forEach(node => {
    const level = levels.get(node.id) || 0;
    if (!nodesAtLevel.has(level)) {
      nodesAtLevel.set(level, []);
    }
    nodesAtLevel.get(level)?.push(node);
  });
  
  // Position nodes
  const verticalSpacing = 150;
  const horizontalSpacing = 120;
  
  for (let level = 0; level <= maxLevel; level++) {
    const levelNodes = nodesAtLevel.get(level) || [];
    const levelWidth = levelNodes.length * horizontalSpacing;
    const startX = -levelWidth / 2;
    
    levelNodes.forEach((node, idx) => {
      const x = startX + idx * horizontalSpacing + horizontalSpacing / 2;
      const y = level * verticalSpacing - (maxLevel * verticalSpacing) / 2;
      
      nodeMap.set(node.id, {
        ...node,
        position: { x, y }
      });
    });
  }
  
  return { 
    nodes: Array.from(nodeMap.values()),
    edges
  };
};

// Apply layout based on selected type
export const calculateOptimalLayout = (
  nodes: Node[], 
  edges: Edge[], 
  layoutType: LayoutType = 'force'
) => {
  switch (layoutType) {
    case 'radial':
      return calculateRadialLayout(nodes, edges);
    case 'hierarchical':
      return calculateHierarchicalLayout(nodes, edges);
    case 'force':
    default:
      return calculateForceLayout(nodes, edges);
  }
};
