import { useCallback } from 'react';
import { Node, Edge } from '@xyflow/react';
import { supabase } from '@/integrations/supabase/client';
import { LayoutType } from '@/hooks/useGraphSettings';

// Function to calculate force-directed layout
const calculateForceLayout = (nodes: Node[], edges: Edge[]) => {
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
const calculateRadialLayout = (nodes: Node[], edges: Edge[]) => {
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
const calculateHierarchicalLayout = (nodes: Node[], edges: Edge[]) => {
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
const calculateOptimalLayout = (
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

// Chunking function for processing large datasets in batches
const processInChunks = <T,>(items: T[], chunkSize: number, processor: (chunk: T[]) => void): Promise<void> => {
  return new Promise((resolve) => {
    const chunks = Math.ceil(items.length / chunkSize);
    let processed = 0;
    
    const processNextChunk = () => {
      if (processed >= chunks) {
        resolve();
        return;
      }
      
      const start = processed * chunkSize;
      const end = Math.min(start + chunkSize, items.length);
      const chunk = items.slice(start, end);
      
      processor(chunk);
      processed++;
      
      setTimeout(processNextChunk, 0); // Allow UI to update between chunks
    };
    
    processNextChunk();
  });
};

export const useGraphData = () => {
  // Process and filter graph data
  const applyLayout = useCallback((
    notesData: any[],
    linksData: any[],
    searchQuery: string,
    selectedTags: string[],
    showIsolatedNodes: boolean,
    layoutType: LayoutType = 'force'
  ) => {
    // Filter notes based on search and tags
    const filteredNotes = notesData.filter(note => {
      // Apply search filtering
      if (searchQuery) {
        const noteTitle = note.title?.toLowerCase() || '';
        const noteContent = typeof note.content === 'string' 
          ? note.content.toLowerCase() 
          : (note.content?.text || '').toLowerCase();
        const searchLower = searchQuery.toLowerCase();
        
        // Skip if neither title nor content match the search
        if (!noteTitle.includes(searchLower) && !noteContent.includes(searchLower)) {
          return false;
        }
      }
      
      // Apply tag filtering
      if (selectedTags.length > 0) {
        const noteTags = Array.isArray(note.tags) ? note.tags : [];
        if (!noteTags.some(tag => selectedTags.includes(tag))) {
          return false;
        }
      }
      
      return true;
    });

    // Create nodes
    const noteNodes: Node[] = filteredNotes.map((note) => ({
      id: note.id,
      type: 'noteNode',
      position: { x: 0, y: 0 }, // Will be calculated by layout algorithm
      data: { note }
    }));
    
    // For large graphs, we need to be efficient with edge creation
    const visibleNodeIds = new Set(noteNodes.map(node => node.id));
    
    // Filter links to only include visible nodes
    const visibleEdges = linksData.filter(
      edge => {
        const sourceId = edge.sourceId || edge.source_id || edge.source;
        const targetId = edge.targetId || edge.target_id || edge.target;
        return visibleNodeIds.has(sourceId) && visibleNodeIds.has(targetId);
      }
    ).map(link => {
      const sourceId = link.sourceId || link.source_id || link.source;
      const targetId = link.targetId || link.target_id || link.target;
      return {
        id: `e-${sourceId}-${targetId}`,
        source: sourceId,
        target: targetId,
        animated: false,
        style: { stroke: "#9d5cff", strokeWidth: 2 },
      };
    });
    
    // Apply layout algorithm based on selected layout type
    const { nodes: layoutedNodes, edges: layoutedEdges } = calculateOptimalLayout(
      noteNodes, 
      visibleEdges, 
      layoutType
    );
    
    return {
      nodes: layoutedNodes,
      edges: layoutedEdges
    };
  }, []);

  // Process graph data specifically for a single node and its connections
  const processGraphData = useCallback(async (
    nodeId: string,
    searchQuery: string,
    selectedTags: string[],
    showIsolatedNodes: boolean,
    layoutType: LayoutType = 'force'
  ) => {
    try {
      // Fetch the central node
      const { data: nodeData, error: nodeError } = await supabase
        .from('nodes')
        .select('*')
        .eq('id', nodeId)
        .single();
        
      if (nodeError) throw nodeError;
      
      // Since we don't have a get_connected_nodes RPC function, 
      // let's use a direct query to get connected nodes
      const { data: linkData, error: linkError } = await supabase
        .from('links')
        .select('source_id, target_id')
        .or(`source_id.eq.${nodeId},target_id.eq.${nodeId}`);
        
      if (linkError) throw linkError;
      
      // Process the result to extract node IDs
      const connectedNodeIds = new Set<string>();
      
      if (linkData && Array.isArray(linkData)) {
        linkData.forEach(link => {
          if (link.source_id === nodeId) {
            connectedNodeIds.add(link.target_id);
          } else {
            connectedNodeIds.add(link.source_id);
          }
        });
      }
      
      // Always include the central node
      connectedNodeIds.add(nodeId);
      
      const connectedNodesArray = Array.from(connectedNodeIds);
      
      // Efficiently fetch all related nodes
      const { data: relatedNodes, error: relatedError } = await supabase
        .from('nodes')
        .select('*')
        .in('id', connectedNodesArray);
        
      if (relatedError) throw relatedError;
      
      // Get links between these nodes
      const { data: links, error: linksError } = await supabase
        .from('links')
        .select('*')
        .or(`source_id.in.(${connectedNodesArray.join(',')}),target_id.in.(${connectedNodesArray.join(',')})`);
        
      if (linksError) throw linksError;
      
      // Format nodes and links for graph layout
      const formattedLinks = links.map(link => ({
        sourceId: link.source_id,
        targetId: link.target_id,
        id: link.id
      }));
      
      // Combine central node with related nodes
      const allNodes = [nodeData, ...relatedNodes]
        .filter((node, index, self) => 
          // Remove duplicates
          index === self.findIndex(n => n.id === node.id)
        )
        .map(node => {
          // Extract tags from content
          let nodeTags: string[] = [];
          const nodeContent = node.content;
          
          if (nodeContent) {
            if (typeof nodeContent === 'object') {
              // If content is an object, try to get tags from it
              nodeTags = Array.isArray(nodeContent.tags) ? nodeContent.tags : [];
            }
          }
          
          return {
            ...node,
            tags: nodeTags
          };
        });
      
      // Apply filters and layout
      return applyLayout(
        allNodes,
        formattedLinks,
        searchQuery,
        selectedTags,
        showIsolatedNodes,
        layoutType
      );
    } catch (error) {
      console.error("Error fetching local graph data:", error);
      return { nodes: [], edges: [] };
    }
  }, [applyLayout]);

  return {
    applyLayout,
    processGraphData
  };
};
