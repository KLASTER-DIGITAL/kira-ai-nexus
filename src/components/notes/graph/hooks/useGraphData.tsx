
import { useCallback, useState, useEffect } from 'react';
import { Node, Edge } from '@xyflow/react';
import { Note } from '@/types/notes';

// Utility function for layout
const graphLayout = (nodes: Node[], edges: Edge[]) => {
  // Simple layout function - in a real app, you might use a more sophisticated algorithm
  const nodeMap = new Map();
  nodes.forEach((node, index) => {
    const position = {
      x: 100 + (index % 5) * 200,
      y: 100 + Math.floor(index / 5) * 150
    };
    nodeMap.set(node.id, { ...node, position });
  });
  
  return { 
    nodes: Array.from(nodeMap.values()),
    edges
  };
};

export const useGraphData = (
  notesData: Note[],
  linksData: Edge[],
  searchQuery: string,
  selectedTags: string[]
) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isLayouting, setIsLayouting] = useState(false);

  // Set up the flow data
  const setupFlowData = useCallback((notes: Note[], links: Edge[]) => {
    // Create nodes from notes
    const noteNodes: Node[] = notes.map((note) => {
      // Extract tags for filtering
      const tags = note.tags || [];
      
      // Apply tag filtering if any tags are selected
      if (selectedTags.length > 0 && !tags.some(tag => selectedTags.includes(tag))) {
        return null; // Skip this note if it doesn't have any of the selected tags
      }
      
      // Apply search filtering
      if (searchQuery) {
        const noteTitle = note.title.toLowerCase();
        const noteContent = getNoteSearchContent(note);
        const searchLower = searchQuery.toLowerCase();
        
        // Skip if neither title nor content match the search
        if (!noteTitle.includes(searchLower) && !noteContent.toLowerCase().includes(searchLower)) {
          return null;
        }
      }
      
      return {
        id: note.id,
        type: 'noteNode',
        position: { x: 0, y: 0 }, // Will be calculated by layout algorithm
        data: { note }
      };
    }).filter(Boolean) as Node[];
    
    // Filter edges to only include visible nodes
    const visibleNodeIds = noteNodes.map(node => node.id);
    const visibleEdges = links.filter(
      edge => visibleNodeIds.includes(edge.source) && visibleNodeIds.includes(edge.target)
    );
    
    // Apply layout algorithm
    const { nodes: layoutedNodes, edges: layoutedEdges } = graphLayout(noteNodes, visibleEdges);
    
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [selectedTags, searchQuery]);

  // Update nodes and edges when data changes
  useEffect(() => {
    if (notesData && linksData) {
      setIsLayouting(true);
      setupFlowData(notesData, linksData);
      setIsLayouting(false);
    }
  }, [notesData, linksData, setupFlowData]);

  // Apply layout
  const applyLayout = useCallback(() => {
    if (notesData && linksData) {
      setIsLayouting(true);
      setupFlowData(notesData, linksData);
      setIsLayouting(false);
    }
  }, [notesData, linksData, setupFlowData]);

  return {
    nodes,
    edges,
    isLayouting,
    setNodes,
    setEdges,
    applyLayout
  };
};

// Utility function for search
const getNoteSearchContent = (note: Note): string => {
  let textContent = '';
  
  if (typeof note.content === 'object') {
    textContent = note.content.text || '';
  } else if (typeof note.content === 'string') {
    textContent = note.content;
  }
  
  return textContent;
};
