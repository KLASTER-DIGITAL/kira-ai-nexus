
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ReactFlow,
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
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useGraphSettings } from '@/hooks/useGraphSettings';
import GraphSearchInput from './components/GraphSearchInput';
import { GraphFilterPanel } from './components/GraphFilterPanel';
import GraphControlPanel from './components/GraphControlPanel';
import NoteNode from '../notes/graph/NoteNode';
import TaskNode from './nodes/TaskNode';
import EventNode from './nodes/EventNode';
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
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const reactFlowInstance = useReactFlow();
  
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

  // Function to generate nodes and edges from the data
  const generateNodesAndEdges = useCallback((
    nodeData: any[],
    edgeData: any[],
    settings: any,
    searchFilter?: string
  ) => {
    // Filter nodes based on settings and search term
    let filteredNodes = [...nodeData];
    
    // Filter by node type
    filteredNodes = filteredNodes.filter(node => {
      if (node.type === 'note' && !settings.showNotes) return false;
      if (node.type === 'task' && !settings.showTasks) return false;
      if (node.type === 'event' && !settings.showEvents) return false;
      return true;
    });
    
    // Filter by search term
    if (searchFilter && searchFilter.trim() !== '') {
      const term = searchFilter.toLowerCase();
      filteredNodes = filteredNodes.filter(node => 
        node.title?.toLowerCase().includes(term) || 
        node.content?.toLowerCase().includes(term)
      );
    }
    
    // Filter by tags
    if (settings.selectedTags.length > 0) {
      filteredNodes = filteredNodes.filter(node => 
        node.tags && settings.selectedTags.some(tag => node.tags.includes(tag))
      );
    }
    
    // Find connected node IDs
    const connectedNodeIds = new Set<string>();
    edgeData.forEach(edge => {
      const sourceExists = filteredNodes.some(n => n.id === edge.source_id);
      const targetExists = filteredNodes.some(n => n.id === edge.target_id);
      
      if (sourceExists) connectedNodeIds.add(edge.source_id);
      if (targetExists) connectedNodeIds.add(edge.target_id);
    });
    
    // Filter out isolated nodes if setting is off
    if (!settings.showIsolatedNodes) {
      filteredNodes = filteredNodes.filter(node => connectedNodeIds.has(node.id));
    }
    
    // Create React Flow nodes
    const flowNodes: Node[] = filteredNodes.map(node => ({
      id: node.id,
      type: `${node.type}Node`,
      data: {
        note: node.type === 'note' ? node : undefined,
        task: node.type === 'task' ? node : undefined,
        event: node.type === 'event' ? node : undefined,
        label: node.title,
        content: node.content,
        tags: node.tags || []
      },
      position: settings.savedPositions[node.id] || { 
        x: Math.random() * 500, 
        y: Math.random() * 500 
      }
    }));
    
    // Create React Flow edges
    const flowEdges: Edge[] = edgeData
      .filter(edge => {
        const sourceExists = filteredNodes.some(n => n.id === edge.source_id);
        const targetExists = filteredNodes.some(n => n.id === edge.target_id);
        return sourceExists && targetExists;
      })
      .map(edge => ({
        id: edge.id || `${edge.source_id}-${edge.target_id}`,
        source: edge.source_id,
        target: edge.target_id,
        type: edge.type || 'default',
        animated: true
      }));
      
    return { nodes: flowNodes, edges: flowEdges };
  }, []);

  // Update nodes and edges when data or filters change
  useEffect(() => {
    const { nodes: flowNodes, edges: flowEdges } = generateNodesAndEdges(
      data.nodes,
      data.edges,
      settings,
      searchTerm
    );
    setNodes(flowNodes);
    setEdges(flowEdges);
  }, [data, settings, searchTerm, generateNodesAndEdges, setNodes, setEdges]);
  
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

  // Register hotkey actions for the graph
  const hotKeyActions = useMemo(() => ({
    zoomIn: () => reactFlowInstance.zoomIn({ duration: 300 }),
    zoomOut: () => reactFlowInstance.zoomOut({ duration: 300 }),
    fitView: () => reactFlowInstance.fitView({ duration: 500 }),
    reset: () => {
      const { nodes: flowNodes, edges: flowEdges } = generateNodesAndEdges(
        data.nodes,
        data.edges,
        settings,
        searchTerm
      );
      setNodes(flowNodes);
      setEdges(flowEdges);
      setTimeout(() => reactFlowInstance.fitView({ duration: 500 }), 50);
    }
  }), [reactFlowInstance, data, settings, searchTerm, generateNodesAndEdges, setNodes, setEdges]);

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
