
import React, { useCallback } from 'react';
import {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  useReactFlow
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { Note } from '@/types/notes';
import { useGraphHotkeys } from './hooks/useGraphHotkeys';
import { useGraphData } from './hooks/useGraphData';
import { useGraphFiltering } from './hooks/useGraphFiltering';
import GraphLayout from './components/GraphLayout';

interface NotesGraphProps {
  nodeId?: string;
  onNodeClick?: (nodeId: string) => void;
}

const NotesGraphInner: React.FC<NotesGraphProps> = ({ nodeId, onNodeClick }) => {
  // Set up state for filters
  const {
    selectedTags,
    searchQuery,
    showIsolatedNodes,
    setSearchQuery,
    toggleTag,
    clearFilters,
  } = useGraphFiltering();
  
  // Set up nodes and edges state
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  
  // Load mock data for demo purposes (replace with real data)
  const notesData = React.useMemo(() => {
    const storedNotes = localStorage.getItem('graphNotes');
    return storedNotes ? JSON.parse(storedNotes) : [];
  }, []);
  
  const linksData = React.useMemo(() => {
    const storedLinks = localStorage.getItem('graphLinks');
    return storedLinks ? JSON.parse(storedLinks) : [];
  }, []);
  
  const allTags = React.useMemo(() => {
    const storedTags = localStorage.getItem('graphTags');
    return storedTags ? JSON.parse(storedTags) : [];
  }, []);
  
  // Set up graph data and controls
  const reactFlowInstance = useReactFlow();
  const { applyLayout } = useGraphData(notesData, linksData, searchQuery, selectedTags);

  // Set up hotkeys
  useGraphHotkeys({
    zoomIn: () => reactFlowInstance.zoomIn(),
    zoomOut: () => reactFlowInstance.zoomOut(),
    fitView: () => reactFlowInstance.fitView(),
    reset: () => applyLayout()
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
