
import React, { useCallback, useState } from 'react';
import ReactFlow, { useNodesState, useEdgesState, Controls, MiniMap, Background } from 'reactflow';
import 'reactflow/dist/style.css';
import { GraphFilteringControls } from './components/GraphFilteringControls';
import { GraphToolbar } from './components/GraphToolbar';
import { useGraphData } from '@/hooks/useGraphData';
import { useGraphDataFiltering } from './hooks/useGraphDataFiltering';
import NoteNode from './NoteNode';

const nodeTypes = {
  note: NoteNode,
};

export interface NotesGraphProps {
  onNodeClick: (nodeId: string) => void;
}

export const NotesGraph: React.FC<NotesGraphProps> = ({ onNodeClick }) => {
  const { graphData, isLoading } = useGraphData();
  const {
    filteredNodes,
    filteredEdges,
    selectedTags,
    setSelectedTags,
    searchTerm,
    setSearchTerm,
    tagCounts,
  } = useGraphDataFiltering(graphData);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Set filtered data to ReactFlow
  React.useEffect(() => {
    if (filteredNodes) setNodes(filteredNodes);
    if (filteredEdges) setEdges(filteredEdges);
  }, [filteredNodes, filteredEdges, setNodes, setEdges]);

  // Handle node click
  const handleNodeClick = useCallback(
    (event: React.MouseEvent, node: { id: string }) => {
      onNodeClick(node.id);
    },
    [onNodeClick]
  );

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-primary rounded-full" aria-hidden="true"></div>
          <p className="mt-2 text-sm text-muted-foreground">Загрузка графа заметок...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full relative">
      <GraphFilteringControls
        tags={graphData?.tags || []}
        tagCounts={tagCounts}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      
      <GraphToolbar />

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default NotesGraph;
