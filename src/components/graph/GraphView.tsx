
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import ReactFlow, { 
  Node, 
  Edge,
  Controls,
  Background, 
  useNodesState,
  useEdgesState,
  ConnectionLineType,
  Panel
} from 'reactflow';
import 'reactflow/dist/style.css';

import { GraphSearchInput } from './components/GraphSearchInput';
import { GraphFilterPanel } from './components/GraphFilterPanel';
import { GraphControlPanel } from './components/GraphControlPanel';
import { GraphToolbar } from './components/GraphToolbar';
import { EventNode } from './nodes/EventNode';
import { TaskNode } from './nodes/TaskNode';
import { useGraphSettings } from '@/hooks/useGraphSettings';
import { useGraphHotkeys } from './hooks/useGraphHotkeys';

const nodeTypes = {
  task: TaskNode,
  event: EventNode,
  // We'll add note node when it's available
};

interface GraphViewProps {
  data: {
    nodes: Node[];
    edges: Edge[];
  };
  availableTags: string[];
}

export default function GraphView({ data, availableTags }: GraphViewProps) {
  const { 
    settings, 
    saveNodePositions, 
    toggleNotesVisibility, 
    toggleTasksVisibility, 
    toggleEventsVisibility, 
    toggleIsolatedNodesVisibility,
    updateSelectedTags,
    changeLayout
  } = useGraphSettings();

  // Set up nodes and edges
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedNodes, setHighlightedNodes] = useState<string[]>([]);
  
  // Filter the graph based on settings
  useEffect(() => {
    if (!data) return;
    
    let filteredNodes = [...data.nodes];

    // Apply node type filters
    if (!settings.showNotes) {
      filteredNodes = filteredNodes.filter(node => node.type !== 'note');
    }
    
    if (!settings.showTasks) {
      filteredNodes = filteredNodes.filter(node => node.type !== 'task');
    }
    
    if (!settings.showEvents) {
      filteredNodes = filteredNodes.filter(node => node.type !== 'event');
    }

    // Apply tag filters if any are selected
    if (settings.selectedTags.length > 0) {
      filteredNodes = filteredNodes.filter(node => {
        const nodeTags = node.data?.tags || [];
        return settings.selectedTags.some(tag => nodeTags.includes(tag));
      });
    }

    // Get all node IDs that are connected
    const connectedNodeIds = new Set<string>();
    data.edges.forEach(edge => {
      connectedNodeIds.add(edge.source);
      connectedNodeIds.add(edge.target);
    });

    // Filter out isolated nodes if needed
    if (!settings.showIsolatedNodes) {
      filteredNodes = filteredNodes.filter(node => connectedNodeIds.has(node.id));
    }

    // Apply positions from saved settings if available
    filteredNodes = filteredNodes.map(node => {
      if (settings.savedPositions[node.id]) {
        return {
          ...node,
          position: settings.savedPositions[node.id]
        };
      }
      return node;
    });

    // Filter edges to only include edges between visible nodes
    const visibleNodeIds = new Set(filteredNodes.map(node => node.id));
    const filteredEdges = data.edges.filter(
      edge => visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)
    );

    // Apply search highlighting if search is active
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      const matchingNodeIds = filteredNodes
        .filter(node => 
          node.data.label.toLowerCase().includes(lowerQuery) ||
          (node.data.content && node.data.content.toLowerCase().includes(lowerQuery))
        )
        .map(node => node.id);
      
      setHighlightedNodes(matchingNodeIds);
    } else {
      setHighlightedNodes([]);
    }

    // Update graph state
    setNodes(filteredNodes);
    setEdges(filteredEdges);
  }, [data, settings, searchQuery, setNodes, setEdges]);

  // Save node positions when they move
  const onNodeDragStop = useCallback((_, nodes) => {
    const positions = nodes.reduce((acc, node) => {
      acc[node.id] = node.position;
      return acc;
    }, {} as Record<string, { x: number, y: number }>);
    
    saveNodePositions(positions);
  }, [saveNodePositions]);

  // Hook up hotkeys
  useGraphHotkeys({
    onToggleNotes: toggleNotesVisibility,
    onToggleTasks: toggleTasksVisibility,
    onToggleEvents: toggleEventsVisibility,
    onToggleIsolated: toggleIsolatedNodesVisibility,
    onSearch: () => document.querySelector<HTMLInputElement>('input[name="graph-search"]')?.focus(),
  });

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeDragStop={onNodeDragStop}
      nodeTypes={nodeTypes}
      connectionLineType={ConnectionLineType.SmoothStep}
      fitView
    >
      <Panel position="top-left" className="bg-background/80 backdrop-blur p-2 rounded-lg shadow-md">
        <GraphSearchInput 
          onSearch={setSearchQuery} 
          placeholder="Поиск по графу..."
        />
      </Panel>

      <Panel position="top-right" className="bg-background/80 backdrop-blur p-2 rounded-lg shadow-md">
        <GraphFilterPanel
          showNotes={settings.showNotes}
          showTasks={settings.showTasks}
          showEvents={settings.showEvents}
          showIsolatedNodes={settings.showIsolatedNodes}
          availableTags={availableTags}
          selectedTags={settings.selectedTags}
          onToggleNotes={toggleNotesVisibility}
          onToggleTasks={toggleTasksVisibility}
          onToggleEvents={toggleEventsVisibility}
          onToggleIsolatedNodes={toggleIsolatedNodesVisibility}
          onUpdateSelectedTags={updateSelectedTags}
        />
      </Panel>

      <Panel position="bottom-left" className="bg-background/80 backdrop-blur p-2 rounded-lg shadow-md">
        <GraphControlPanel 
          currentLayout={settings.layout} 
          onLayoutChange={changeLayout} 
        />
      </Panel>

      <Panel position="bottom-center" className="bg-background/80 backdrop-blur p-2 rounded-lg shadow-md">
        <GraphToolbar highlightedNodes={highlightedNodes} />
      </Panel>

      <Controls />
      <Background />
    </ReactFlow>
  );
}
