
import React from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Panel,
  useReactFlow
} from '@xyflow/react';
import NoteNode from '../NoteNode';
import GraphControls from './GraphControls';
import GraphSearchBar from './GraphSearchBar';
import GraphFilterPopover from './GraphFilterPopover';
import GraphToolbar from './GraphToolbar';

interface GraphLayoutProps {
  nodes: any[];
  edges: any[];
  onNodesChange: any;
  onEdgesChange: any;
  onNodeClick?: (nodeId: string) => void;
}

const GraphLayout: React.FC<GraphLayoutProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onNodeClick,
}) => {
  const reactFlowInstance = useReactFlow();
  const nodeTypes = { noteNode: NoteNode };

  return (
    <ReactFlow 
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      onNodeClick={(_, node) => onNodeClick && onNodeClick(node.id)}
      fitView
      minZoom={0.1}
      maxZoom={2}
    >
      <Panel position="top-left">
        <GraphSearchBar 
          searchTerm=""
          setSearchTerm={() => {}}
        />
      </Panel>
      
      <Panel position="top-right">
        <GraphFilterPopover 
          selectedTags={[]}
          toggleTag={() => {}}
          allTags={[]}
          showIsolatedNodes={true}
          setShowIsolatedNodes={() => {}}
        />
      </Panel>
      
      <Panel position="bottom-center">
        <GraphToolbar
          searchTerm=""
          setSearchTerm={() => {}}
          selectedTags={[]}
          toggleTag={() => {}}
          allTags={[]}
          showIsolatedNodes={true}
          setShowIsolatedNodes={() => {}}
        />
      </Panel>
      
      <Panel position="bottom-right">
        <GraphControls
          onZoomIn={() => reactFlowInstance.zoomIn()}
          onZoomOut={() => reactFlowInstance.zoomOut()}
          onFitView={() => reactFlowInstance.fitView()}
          onReset={() => {}}
        />
      </Panel>
      
      <Background 
        variant={BackgroundVariant.Dots} 
        gap={12} 
        size={1} 
        color="#88888833" 
      />
    </ReactFlow>
  );
};

export default GraphLayout;
