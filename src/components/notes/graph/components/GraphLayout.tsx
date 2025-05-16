
import React from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Panel,
  useReactFlow,
  Controls
} from '@xyflow/react';
import NoteNode from '../NoteNode';
import GraphControls from './GraphControls';
import GraphSearchBar from './GraphSearchBar';
import GraphFilterPopover from './GraphFilterPopover';
import GraphToolbar from './GraphToolbar';
import { Spinner } from "@/components/ui/spinner";

interface GraphLayoutProps {
  nodes: any[];
  edges: any[];
  onNodesChange: any;
  onEdgesChange: any;
  onNodeClick?: (nodeId: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedTags: string[];
  toggleTag: (tag: string) => void;
  allTags: string[];
  showIsolatedNodes: boolean;
  toggleIsolatedNodes: () => void;
  isLoading: boolean;
  clearFilters: () => void;
}

const GraphLayout: React.FC<GraphLayoutProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onNodeClick,
  searchQuery,
  setSearchQuery,
  selectedTags,
  toggleTag,
  allTags,
  showIsolatedNodes,
  toggleIsolatedNodes,
  isLoading,
  clearFilters
}) => {
  const reactFlowInstance = useReactFlow();
  const nodeTypes = { noteNode: NoteNode };
  
  return (
    <div className="w-full h-full relative">
      {isLoading && (
        <div className="absolute inset-0 bg-background/50 z-50 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      )}
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
        nodesDraggable={true}
        // Enable virtual rendering for better performance with large graphs
        nodesFocusable={true}
        elementsSelectable={true}
        nodesConnectable={false}
      >
        <Panel position="top-left">
          <GraphSearchBar 
            searchTerm={searchQuery}
            setSearchTerm={setSearchQuery}
          />
        </Panel>
        
        <Panel position="top-right">
          <GraphFilterPopover 
            selectedTags={selectedTags}
            toggleTag={toggleTag}
            allTags={allTags}
            showIsolatedNodes={showIsolatedNodes}
            setShowIsolatedNodes={toggleIsolatedNodes}
          />
        </Panel>
        
        <Panel position="bottom-center">
          <GraphToolbar
            searchTerm={searchQuery}
            setSearchTerm={setSearchQuery}
            selectedTags={selectedTags}
            toggleTag={toggleTag}
            allTags={allTags}
            showIsolatedNodes={showIsolatedNodes}
            setShowIsolatedNodes={toggleIsolatedNodes}
            hasFilters={searchQuery !== "" || selectedTags.length > 0}
            clearFilters={clearFilters}
          />
        </Panel>
        
        <Panel position="bottom-right">
          <GraphControls
            onZoomIn={() => reactFlowInstance.zoomIn()}
            onZoomOut={() => reactFlowInstance.zoomOut()}
            onFitView={() => reactFlowInstance.fitView()}
            onReset={() => reactFlowInstance.fitView({ duration: 800 })}
          />
        </Panel>
        
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={12} 
          size={1} 
          color="#88888833" 
        />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default GraphLayout;
