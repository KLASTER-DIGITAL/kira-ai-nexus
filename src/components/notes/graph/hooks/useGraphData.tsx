
import { useCallback, useState, useEffect, useMemo } from 'react';
import { Node, Edge } from '@xyflow/react';
import { Note } from '@/types/notes';
import { LinksData } from '@/components/notes/graph/types';
import { supabase } from '@/integrations/supabase/client';

// Improved layout function with better positioning for large graphs
const calculateOptimalLayout = (nodes: Node[], edges: Edge[]) => {
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
    notesData: Note[],
    linksData: LinksData[],
    searchQuery: string,
    selectedTags: string[],
    showIsolatedNodes: boolean
  ) => {
    // Filter notes based on search and tags
    const filteredNotes = notesData.filter(note => {
      // Apply search filtering
      if (searchQuery) {
        const noteTitle = note.title.toLowerCase();
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
      edge => visibleNodeIds.has(edge.sourceId) && visibleNodeIds.has(edge.targetId)
    ).map(link => ({
      id: `e-${link.sourceId}-${link.targetId}`,
      source: link.sourceId,
      target: link.targetId,
      animated: false,
      style: { stroke: "#9d5cff", strokeWidth: 2 },
    }));
    
    // Apply layout algorithm
    const { nodes: layoutedNodes, edges: layoutedEdges } = calculateOptimalLayout(noteNodes, visibleEdges);
    
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
    showIsolatedNodes: boolean
  ) => {
    try {
      // Fetch the central node
      const { data: nodeData, error: nodeError } = await supabase
        .from('nodes')
        .select('*')
        .eq('id', nodeId)
        .single();
        
      if (nodeError) throw nodeError;
      
      // Get connected nodes (1-2 levels deep is usually enough for local view)
      const { data: linkedNodeIds, error: linkError } = await supabase
        .rpc('get_connected_nodes', { node_id: nodeId, depth: 1 });
        
      if (linkError) throw linkError;
      
      // Efficiently fetch all related nodes
      const { data: relatedNodes, error: relatedError } = await supabase
        .from('nodes')
        .select('*')
        .in('id', linkedNodeIds);
        
      if (relatedError) throw relatedError;
      
      // Get links between these nodes
      const { data: links, error: linksError } = await supabase
        .from('links')
        .select('*')
        .or(`source_id.in.(${linkedNodeIds.join(',')}),target_id.in.(${linkedNodeIds.join(',')})`);
        
      if (linksError) throw linksError;
      
      // Format nodes and links for graph layout
      const formattedLinks = links.map(link => ({
        sourceId: link.source_id,
        targetId: link.target_id,
        id: link.id
      }));
      
      // Apply filters and layout
      return applyLayout(
        [nodeData, ...relatedNodes],
        formattedLinks,
        searchQuery,
        selectedTags,
        showIsolatedNodes
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
