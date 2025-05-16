
import { useCallback } from 'react';
import { Node, Edge } from '@xyflow/react';
import { extractTags } from '../utils/dataUtils';
import { calculateOptimalLayout } from '../utils/layoutUtils';
import { LayoutType } from '@/hooks/useGraphSettings';

export const useGraphDataFiltering = () => {
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
        // Safely extract tags from the note content
        const noteTags = extractTags(note.content);
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

  return {
    applyLayout,
  };
};
