
import React, { useState, useEffect, useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  NodeTypes,
  EdgeTypes,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useGraphSettings } from '@/hooks/useGraphSettings';
import { useGraphHotkeys } from './hooks/useGraphHotkeys';
import GraphSearchInput from './components/GraphSearchInput';
import { GraphFilterPanel } from './components/GraphFilterPanel';
import GraphControlPanel from './components/GraphControlPanel';
import NoteNode from '../notes/graph/NoteNode';
import TaskNode from './nodes/TaskNode';
import EventNode from './nodes/EventNode';
import { generateNodesAndEdges } from './utils/graphUtils';
import { NodeBasicInfo } from '@/hooks/notes/links/types';

interface GraphViewProps {
  data: {
    nodes: any[];
    edges: any[];
  };
  availableTags: string[];
}

// Define node types
const nodeTypes: NodeTypes = {
  noteNode: NoteNode,
  taskNode: TaskNode,
  eventNode: EventNode,
};

const GraphView: React.FC<GraphViewProps> = ({ data, availableTags = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const {
    settings,
    toggleNotesVisibility,
    toggleTasksVisibility,
    toggleEventsVisibility,
    toggleIsolatedNodesVisibility,
    updateSelectedTags,
    changeLayout,
    saveNodePositions,
  } = useGraphSettings();
  
  // Generate initial nodes and edges
  const { nodes: initialNodes, edges: initialEdges } = generateNodesAndEdges(
    data.nodes,
    data.edges,
    settings
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Filter nodes and edges when search or filters change
  useEffect(() => {
    const { nodes: filteredNodes, edges: filteredEdges } = generateNodesAndEdges(
      data.nodes,
      data.edges,
      settings,
      searchTerm
    );
    setNodes(filteredNodes);
    setEdges(filteredEdges);
  }, [data, settings, searchTerm, setNodes, setEdges]);

  // Save node positions when they change
  const onNodeDragStop = useCallback(
    (event: React.MouseEvent, node: Node) => {
      const positions: Record<string, { x: number; y: number }> = {};
      positions[node.id] = { x: node.position.x, y: node.position.y };
      saveNodePositions(positions);
    },
    [saveNodePositions]
  );

  // Toggle node type visibility
  const toggleNodeTypeVisibility = useCallback(
    (type: 'notes' | 'tasks' | 'events') => {
      switch (type) {
        case 'notes':
          toggleNotesVisibility();
          break;
        case 'tasks':
          toggleTasksVisibility();
          break;
        case 'events':
          toggleEventsVisibility();
          break;
      }
    },
    [toggleNotesVisibility, toggleTasksVisibility, toggleEventsVisibility]
  );

  // Toggle tag selection
  const toggleTag = useCallback(
    (tag: string) => {
      let newSelectedTags: string[];

      if (tag === '') {
        // Clear all tags
        newSelectedTags = [];
      } else if (settings.selectedTags.includes(tag)) {
        // Remove tag
        newSelectedTags = settings.selectedTags.filter((t) => t !== tag);
      } else {
        // Add tag
        newSelectedTags = [...settings.selectedTags, tag];
      }

      updateSelectedTags(newSelectedTags);
    },
    [settings.selectedTags, updateSelectedTags]
  );

  // Register keyboard shortcuts for the graph
  useGraphHotkeys({
    layout: settings.layout,
    onChangeLayout: changeLayout,
  });

  return (
    <div className="h-[calc(100vh-180px)] border rounded-lg relative bg-background">
      <div className="absolute top-0 left-0 right-0 z-10 flex flex-wrap gap-2 p-2 bg-background border-b">
        <GraphSearchInput 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
        />
        
        <GraphFilterPanel 
          selectedTags={settings.selectedTags}
          toggleTag={toggleTag}
          allTags={availableTags}
          settings={{
            showNotes: settings.showNotes,
            showTasks: settings.showTasks,
            showEvents: settings.showEvents,
            showIsolatedNodes: settings.showIsolatedNodes
          }}
          toggleNodeTypeVisibility={toggleNodeTypeVisibility}
          toggleIsolatedNodes={toggleIsolatedNodesVisibility}
        />
      </div>
      
      <div className="pt-14 h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeDragStop={onNodeDragStop}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap 
            nodeStrokeWidth={3}
            nodeColor={(node) => {
              switch (node.type) {
                case 'noteNode':
                  return '#10b981';
                case 'taskNode':
                  return '#3b82f6';
                case 'eventNode':
                  return '#f59e0b';
                default:
                  return '#9d5cff';
              }
            }}
          />
          
          <Panel position="top-right">
            <GraphControlPanel 
              layout={settings.layout}
              onChangeLayout={changeLayout}
            />
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
};

export default GraphView;
