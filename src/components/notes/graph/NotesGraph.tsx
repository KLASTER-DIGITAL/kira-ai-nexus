
import React, { useCallback, useState, useEffect } from 'react';
import {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';

import { useGraphHotkeys } from './hooks/useGraphHotkeys';
import { useGraphData } from './hooks/useGraphData';
import { useGraphFiltering } from './hooks/useGraphFiltering';
import GraphLayout from './components/GraphLayout';
import { useGraphSettings } from '@/hooks/useGraphSettings';
import { useGraphData as useGlobalGraphData } from '@/hooks/useGraphData';

interface NotesGraphProps {
  nodeId?: string;
  onNodeClick?: (nodeId: string) => void;
  localOnly?: boolean;
}

const NotesGraphInner: React.FC<NotesGraphProps> = ({ 
  nodeId, 
  onNodeClick,
  localOnly = false
}) => {
  // Set up state for filters
  const {
    selectedTags,
    searchQuery,
    showIsolatedNodes,
    setSearchQuery,
    toggleTag,
    clearFilters,
  } = useGraphFiltering();
  
  // Use graph settings for persistent user preferences
  const { settings, toggleIsolatedNodesVisibility } = useGraphSettings();
  
  // Set up nodes and edges state
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch graph data - either from global or local source
  const { graphData: globalGraphData, isLoading: isGlobalDataLoading } = useGlobalGraphData();
  const { applyLayout, processGraphData } = useGraphData();
  
  // Load graph data based on props
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (localOnly && nodeId) {
          // Local graph - fetch only connected nodes for the specific nodeId
          const { nodes: layoutedNodes, edges: layoutedEdges } = await processGraphData(
            nodeId,
            searchQuery, 
            selectedTags,
            showIsolatedNodes
          );
          setNodes(layoutedNodes);
          setEdges(layoutedEdges);
        } else {
          // Global graph - use all data
          if (globalGraphData) {
            const { nodes: layoutedNodes, edges: layoutedEdges } = applyLayout(
              globalGraphData.nodes,
              globalGraphData.links,
              searchQuery, 
              selectedTags,
              showIsolatedNodes
            );
            setNodes(layoutedNodes);
            setEdges(layoutedEdges);
          }
        }
      } catch (error) {
        console.error("Error loading graph data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [nodeId, globalGraphData, searchQuery, selectedTags, showIsolatedNodes, localOnly, applyLayout, processGraphData]);
  
  // Set up hotkeys for graph navigation
  useGraphHotkeys({
    zoomIn: () => {},
    zoomOut: () => {},
    fitView: () => {},
    reset: () => applyLayout(
      globalGraphData?.nodes || [], 
      globalGraphData?.links || [], 
      searchQuery, 
      selectedTags, 
      showIsolatedNodes
    )
  });

  // Handle node click
  const handleNodeClick = useCallback((clickedNodeId: string) => {
    console.log("Выбрана заметка в графе:", clickedNodeId);
    if (onNodeClick) {
      onNodeClick(clickedNodeId);
    }
  }, [onNodeClick]);

  return (
    <div className="w-full h-full">
      <GraphLayout 
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedTags={selectedTags}
        toggleTag={toggleTag}
        allTags={globalGraphData?.tags || []}
        showIsolatedNodes={showIsolatedNodes}
        toggleIsolatedNodes={toggleIsolatedNodesVisibility}
        isLoading={isLoading || isGlobalDataLoading}
        clearFilters={clearFilters}
      />
    </div>
  );
};

// Wrap with ReactFlowProvider to ensure context is available
const NotesGraph: React.FC<NotesGraphProps> = (props) => {
  return (
    <ReactFlowProvider>
      <NotesGraphInner {...props} />
    </ReactFlowProvider>
  );
};

export default NotesGraph;
